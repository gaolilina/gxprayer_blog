/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  MarkerOkayCancelDialog: () => MarkerOkayCancelDialog,
  MarkerSupportedLangsDialog: () => MarkerSupportedLangsDialog,
  default: () => Marker
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  markerEndpoint: "localhost:8000",
  createFolder: true,
  deleteOriginal: false,
  extractContent: "all",
  writeMetadata: false,
  movePDFtoFolder: false,
  createAssetSubfolder: true,
  apiEndpoint: "selfhosted",
  apiKey: "",
  langs: "en",
  forceOCR: false,
  paginate: false
};
var Marker = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommands();
    this.addSettingTab(new MarkerSettingTab(this.app, this));
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file, source) => {
        if (!file.name.endsWith(".pdf")) {
          if (this.settings.apiEndpoint === "datalab") {
            if (!file.name.endsWith(".docx") && !file.name.endsWith(".pptx") && !file.name.endsWith(".ppt") && !file.name.endsWith(".doc")) {
              return;
            }
          } else
            return;
        }
        menu.addItem((item) => {
          item.setIcon("pdf-file");
          switch (file.name.split(".").pop()) {
            case "pdf":
              item.setTitle("Convert PDF to MD");
              break;
            case "docx":
              item.setTitle("Convert DOCX to MD");
              break;
            case "pptx":
              item.setTitle("Convert PPTX to MD");
              break;
            case "ppt":
              item.setTitle("Convert PPT to MD");
              break;
            case "doc":
              item.setTitle("Convert DOC to MD");
              break;
          }
          item.onClick(async () => {
            if (file instanceof import_obsidian.TFile) {
              if (this.settings.apiEndpoint === "datalab") {
                await this.convertWithDatalab(file);
              } else {
                await this.convertPDFToMD(file);
              }
            }
          });
        });
      })
    );
  }
  addCommands() {
    this.addCommand({
      id: "marker-convert-to-md",
      name: "Convert to MD",
      checkCallback: (checking) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (this.settings.apiEndpoint === "datalab") {
          if ((activeFile == null ? void 0 : activeFile.extension) !== "pdf" && (activeFile == null ? void 0 : activeFile.extension) !== "docx" && (activeFile == null ? void 0 : activeFile.extension) !== "pptx" && (activeFile == null ? void 0 : activeFile.extension) !== "ppt" && (activeFile == null ? void 0 : activeFile.extension) !== "doc") {
            return false;
          }
        } else if ((activeFile == null ? void 0 : activeFile.extension) !== "pdf") {
          return false;
        }
        if (checking) {
          return true;
        }
        if (this.settings.apiEndpoint === "datalab") {
          this.convertWithDatalab(activeFile);
        } else {
          this.convertPDFToMD(activeFile);
        }
      }
    });
  }
  async convertPDFToMD(file) {
    const activeFile = file;
    if (!activeFile) {
      return false;
    }
    if (!this.checkSettings()) {
      return false;
    }
    await this.testConnection(true).then(async (result) => {
      if (!result) {
        return false;
      } else {
        try {
          const folderPath = await this.handleFolderCreation(activeFile);
          if (!folderPath) {
            return true;
          }
          if (this.settings.extractContent === "images" || this.settings.extractContent === "all") {
            const shouldOverwrite = await this.checkForExistingFiles(
              folderPath
            );
            if (!shouldOverwrite) {
              return true;
            }
          }
          const pdfContent = await this.app.vault.readBinary(activeFile);
          if (this.settings.extractContent === "text" || this.settings.extractContent === "all") {
            new import_obsidian.Notice(
              "Converting PDF to Markdown, this can take a few seconds...",
              1e4
            );
          } else {
            new import_obsidian.Notice("Extracting images from PDF...", 1e4);
          }
          const conversionResult = await this.convertPDFContent(pdfContent);
          await this.processConversionResult(
            conversionResult,
            folderPath,
            activeFile
          );
          new import_obsidian.Notice("PDF conversion completed");
        } catch (error) {
          console.error("Error during PDF conversion:", error);
          new import_obsidian.Notice(
            "Error during PDF conversion. Check console for details."
          );
        }
        return true;
      }
    }).catch((error) => {
      console.error("Error during PDF conversion:", error);
      new import_obsidian.Notice("Error during PDF conversion. Check console for details.");
      return false;
    });
    return true;
  }
  createFormBody(formData) {
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    let body = "";
    formData.forEach((value, key) => {
      body += `--${boundary}\r
`;
      body += `Content-Disposition: form-data; name="${key}"`;
      if (value instanceof File) {
        body += `; filename="${value.name}"\r
`;
        body += `Content-Type: ${value.type}\r
\r
`;
        value.arrayBuffer().then((buffer) => {
          body += (0, import_obsidian.arrayBufferToBase64)(buffer);
        });
      } else {
        body += "\r\n\r\n" + value;
      }
      body += "\r\n";
    });
    body += `--${boundary}--\r
`;
    return { body, boundary };
  }
  async convertWithDatalab(file) {
    const activeFile = file;
    if (!activeFile) {
      return false;
    }
    if (!this.checkSettings()) {
      return false;
    }
    await this.testConnection(true).then(async (result) => {
      var _a, _b;
      if (!result) {
        return false;
      } else {
        try {
          const folderPath = await this.handleFolderCreation(activeFile);
          if (!folderPath) {
            return true;
          }
          if (this.settings.extractContent === "images" || this.settings.extractContent === "all") {
            const shouldOverwrite = await this.checkForExistingFiles(
              folderPath
            );
            if (!shouldOverwrite) {
              return true;
            }
          }
          const pdfContent = await this.app.vault.readBinary(activeFile);
          if (this.settings.extractContent === "text" || this.settings.extractContent === "all") {
            new import_obsidian.Notice(
              "Converting file to Markdown, this can take a few seconds...",
              1e4
            );
          } else {
            new import_obsidian.Notice("Extracting images from file...", 1e4);
          }
          const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
          const parts = [];
          const fileFieldName = "file";
          let contentType = "";
          switch (activeFile.extension) {
            case "pdf":
              contentType = "application/pdf";
              break;
            case "docx":
            case "doc":
              contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
              break;
            case "pptx":
            case "ppt":
              contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
              break;
          }
          parts.push(
            `--${boundary}\r
Content-Disposition: form-data; name="${fileFieldName}"; filename="${activeFile.name}"\r
Content-Type: ${contentType}\r
\r
`
          );
          parts.push(new Uint8Array(pdfContent));
          parts.push("\r\n");
          const addFormField = (name, value) => {
            parts.push(
              `--${boundary}\r
Content-Disposition: form-data; name="${name}"\r
\r
${value}\r
`
            );
          };
          addFormField(
            "extract_images",
            this.settings.extractContent !== "text" ? "true" : "false"
          );
          addFormField("langs", (_a = this.settings.langs) != null ? _a : "en");
          addFormField(
            "force_ocr",
            this.settings.forceOCR ? "true" : "false"
          );
          addFormField("paginate", this.settings.paginate ? "true" : "false");
          parts.push(`--${boundary}--\r
`);
          const bodyParts = parts.map(
            (part) => typeof part === "string" ? new TextEncoder().encode(part) : part
          );
          const bodyLength = bodyParts.reduce(
            (acc, part) => acc + part.byteLength,
            0
          );
          const body = new Uint8Array(bodyLength);
          let offset = 0;
          for (const part of bodyParts) {
            body.set(part, offset);
            offset += part.byteLength;
          }
          const requestParams = {
            url: `https://www.datalab.to/api/v1/marker`,
            method: "POST",
            body: body.buffer,
            headers: {
              "Content-Type": `multipart/form-data; boundary=${boundary}`,
              "X-Api-Key": (_b = this.settings.apiKey) != null ? _b : ""
            },
            throw: false
            // Don't throw on non-200 status codes
          };
          try {
            (0, import_obsidian.requestUrl)(requestParams).then(async (response) => {
              const data = response.json;
              if (response.status === 200) {
                const result2 = await this.pollForConversionResult(
                  data.request_check_url
                );
                await this.processConversionResult(
                  result2,
                  folderPath,
                  activeFile
                );
                new import_obsidian.Notice("PDF conversion completed");
              } else {
                console.error("Error with datalab: ", data.detail);
                if (typeof data.detail === "string") {
                  new import_obsidian.Notice(
                    `Error with Datalab Marker API: ${data.detail}`
                  );
                } else {
                  new import_obsidian.Notice(
                    `Error with Datalab Marker API, check console for details`
                  );
                }
              }
            }).catch((error) => {
              console.error("Error in convertWithDatalab:", error);
              throw new Error(`Error in convertWithDatalab: ${error}`);
            });
          } catch (error) {
            console.error("Error in file conversion:", error);
            new import_obsidian.Notice(
              `An error occurred during file conversion: ${error.message}`
            );
            throw error;
          }
        } catch (error) {
          console.error("Error during PDF conversion:", error);
          new import_obsidian.Notice(
            "Error during PDF conversion. Check console for details."
          );
        }
      }
    }).catch((error) => {
      console.error("Error during PDF conversion:", error);
      new import_obsidian.Notice("Error during PDF conversion. Check console for details.");
    });
    return true;
  }
  async handleFolderCreation(activeFile) {
    var _a;
    const folderName = (_a = activeFile.path.replace(/\.pdf(?=[^.]*$)/, "").split("/").pop()) == null ? void 0 : _a.replace(/\./g, "-");
    if (!folderName) {
      return null;
    }
    const folderPath = activeFile.path.replace(/\.pdf(?=[^.]*$)/, "/").split("/").slice(0, -1).join("/") + "/";
    const folder = folderPath ? this.app.vault.getFolderByPath(folderPath.replace(/\/$/, "")) : void 0;
    if (!this.settings.createFolder) {
      return activeFile.path.replace(activeFile.name, "");
    }
    if (folder instanceof import_obsidian.TFolder) {
      return new Promise((resolve) => {
        new MarkerOkayCancelDialog(
          this.app,
          "Folder already exists!",
          `The folder "${folderPath}" already exists. Do you want to integrate the files into this folder?`,
          (result) => resolve(result ? folderPath : null)
        ).open();
      });
    } else {
      await this.app.vault.createFolder(folderPath);
      return folderPath;
    }
  }
  async checkForExistingFiles(folderPath) {
    const existingFiles = this.app.vault.getFiles().filter((file) => file.path.startsWith(folderPath));
    if (existingFiles.length > 0) {
      return new Promise((resolve) => {
        new MarkerOkayCancelDialog(
          this.app,
          "Existing files found",
          "Some files already exist in the target folder. Do you want to overwrite them / integrate the new files into this folder?",
          resolve
        ).open();
      });
    }
    return true;
  }
  async convertPDFContent(pdfContent) {
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    const parts = [];
    parts.push(
      `--${boundary}\r
Content-Disposition: form-data; name="pdf_file"; filename="document.pdf"\r
Content-Type: application/pdf\r
\r
`
    );
    parts.push(new Uint8Array(pdfContent));
    parts.push("\r\n");
    parts.push(
      `--${boundary}\r
Content-Disposition: form-data; name="extract_images"\r
\r
${this.settings.extractContent !== "text" ? "true" : "false"}\r
`
    );
    parts.push(`--${boundary}--\r
`);
    const bodyParts = parts.map(
      (part) => typeof part === "string" ? new TextEncoder().encode(part) : part
    );
    const bodyLength = bodyParts.reduce(
      (acc, part) => acc + part.byteLength,
      0
    );
    const body = new Uint8Array(bodyLength);
    let offset = 0;
    for (const part of bodyParts) {
      body.set(part, offset);
      offset += part.byteLength;
    }
    const requestParams = {
      url: `http://${this.settings.markerEndpoint}/convert`,
      method: "POST",
      body: body.buffer,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      }
    };
    try {
      const response = await (0, import_obsidian.requestUrl)(requestParams);
      if (response.status >= 400) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json;
    } catch (error) {
      console.error("Error in convertPDFContent:", error);
      throw error;
    }
  }
  async pollForConversionResult(requestCheckUrl) {
    var _a, _b;
    let response = await (0, import_obsidian.requestUrl)({
      url: requestCheckUrl,
      method: "GET",
      headers: {
        "X-Api-Key": (_a = this.settings.apiKey) != null ? _a : ""
      },
      throw: false
    });
    let data = await response.json;
    if (response.status >= 400) {
      console.error(`Error while getting results, ${data.detail}`);
    }
    let maxRetries = 300;
    while (data.status !== "complete" && maxRetries > 0) {
      maxRetries--;
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      response = await (0, import_obsidian.requestUrl)({
        url: requestCheckUrl,
        method: "GET",
        headers: {
          "X-Api-Key": (_b = this.settings.apiKey) != null ? _b : ""
        },
        throw: false
      });
      if (maxRetries % 10 === 0) {
        new import_obsidian.Notice("Converting...");
      }
      data = await response.json;
      if (response.status >= 400) {
        console.error(`Error while getting results, ${data.detail}`);
      }
    }
    return data;
  }
  async processConversionResult(data, folderPath, originalFile) {
    if (Array.isArray(data) && data.length === 1) {
      data = data[0];
    } else if (Array.isArray(data) && data.length > 1) {
      new import_obsidian.Notice("Error, multiple files returned");
      return;
    }
    if (this.settings.extractContent !== "images") {
      await this.createMarkdownFile(data.markdown, folderPath, originalFile);
    }
    if (this.settings.extractContent !== "text") {
      let imageFolderPath = folderPath;
      if (this.settings.createAssetSubfolder && data.images && Object.keys(data.images).length > 0) {
        if (!(this.app.vault.getAbstractFileByPath(
          folderPath + "assets"
        ) instanceof import_obsidian.TFolder)) {
          await this.app.vault.createFolder(folderPath + "assets/");
        }
        imageFolderPath += "assets/";
      }
      await this.createImageFiles(data.images, imageFolderPath, originalFile);
    }
    if (this.settings.writeMetadata) {
      const metadata = data.meta || data.metadata;
      await this.addMetadataToMarkdownFile(metadata, folderPath, originalFile);
    }
    if (this.settings.movePDFtoFolder) {
      const newFilePath = folderPath + originalFile.name;
      await this.app.vault.rename(originalFile, newFilePath);
    }
    if (this.settings.deleteOriginal) {
      await this.deleteOriginalFile(originalFile);
    }
  }
  async createMarkdownFile(markdown, folderPath, originalFile) {
    const fileName = originalFile.name.split(".")[0] + ".md";
    const filePath = folderPath + fileName;
    let file;
    if (this.settings.createAssetSubfolder) {
      const cleanImagePath = originalFile.name.replace(/\.pdf(?=[^.]*$)/, "_").replace(/\s+/g, "%20");
      markdown = markdown.replace(
        /!\[.*\]\((.*)\)/g,
        `![$1](assets/${cleanImagePath}$1)`
      );
    }
    if (this.settings.extractContent === "text") {
      markdown = markdown.replace(/!\[.*\]\(.*\)/g, "");
    }
    const existingFile = this.app.vault.getAbstractFileByPath(filePath);
    if (existingFile instanceof import_obsidian.TFile) {
      file = existingFile;
      await this.app.vault.modify(file, markdown);
    } else {
      file = await this.app.vault.create(filePath, markdown);
    }
    new import_obsidian.Notice(`Markdown file created: ${fileName}`);
    this.app.workspace.openLinkText(file.path, "", true);
  }
  async createImageFiles(images, folderPath, originalFile) {
    for (const [imageName, imageBase64] of Object.entries(images)) {
      let newImageName = imageName;
      if (this.settings.createAssetSubfolder) {
        newImageName = originalFile.name.replace(/\.pdf(?=[^.]*$)/, "_") + imageName;
      }
      const imageArrayBuffer = (0, import_obsidian.base64ToArrayBuffer)(imageBase64);
      if (this.app.vault.getAbstractFileByPath(
        folderPath + newImageName
      ) instanceof import_obsidian.TFile) {
        const file = this.app.vault.getAbstractFileByPath(
          folderPath + newImageName
        );
        if (!(file instanceof import_obsidian.TFile)) {
          console.error("Error with image: ", file);
          continue;
        }
        await this.app.vault.modifyBinary(file, imageArrayBuffer);
      } else {
        await this.app.vault.createBinary(
          folderPath + newImageName,
          imageArrayBuffer
        );
      }
    }
    new import_obsidian.Notice(`Image files created successfully`);
  }
  async addMetadataToMarkdownFile(metadata, folderPath, originalFile) {
    const fileName = originalFile.name.split(".")[0] + ".md";
    const filePath = folderPath + fileName;
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (file instanceof import_obsidian.TFile) {
      const frontmatter = this.generateFrontmatter(metadata);
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        return frontmatter + fm;
      }).catch((error) => {
        console.error("Error adding metadata to markdown file:", error);
      });
    }
  }
  generateFrontmatter(metadata) {
    let frontmatter = "---\n";
    const frontmatterKeys = [
      "languages",
      "filetype",
      "ocr_stats",
      "block_stats"
    ];
    for (const [key, value] of Object.entries(metadata)) {
      if (frontmatterKeys.includes(key)) {
        if (key === "ocr_stats" || key === "block_stats") {
          for (const [k, v] of Object.entries(value)) {
            frontmatter += `${k}: ${k === "equations" ? JSON.stringify(v).slice(1, -1).replace(/"/g, "") : v}
`;
          }
        } else {
          frontmatter += `${key}: ${value}
`;
        }
      }
    }
    frontmatter += "---\n";
    return frontmatter;
  }
  async deleteOriginalFile(file) {
    try {
      await this.app.fileManager.trashFile(file);
      new import_obsidian.Notice("Original PDF file deleted");
    } catch (error) {
      console.error("Error deleting original file:", error);
    }
  }
  checkSettings() {
    if (!this.settings.markerEndpoint) {
      new import_obsidian.Notice("Err: Marker API endpoint not set");
      return false;
    }
    if (this.settings.extractContent !== "text" && this.settings.extractContent !== "images" && this.settings.extractContent !== "all") {
      new import_obsidian.Notice(
        "Err: Invalid content extraction setting for Marker, check settings"
      );
      return false;
    }
    return true;
  }
  async testConnection(silent) {
    if (this.settings.apiEndpoint === "datalab") {
      if (!this.settings.apiKey) {
        new import_obsidian.Notice("Err: Datalab API key not set");
        return Promise.resolve(false);
      } else {
        try {
          return (0, import_obsidian.requestUrl)({
            url: "https://www.datalab.to/api/v1/user_health",
            method: "GET",
            headers: {
              "X-Api-Key": this.settings.apiKey
            }
          }).then((response) => {
            if (response.status !== 200) {
              new import_obsidian.Notice(
                `Error connecting to Datalab Marker API: ${response.status}`
              );
              console.error(
                "Error connecting to Datalab Marker API:",
                response.status
              );
              return false;
            } else {
              if (response.json.status === "ok") {
                if (!silent)
                  new import_obsidian.Notice("Connection successful!");
                return true;
              } else {
                new import_obsidian.Notice("Error connecting to Datalab Marker API");
                console.error(
                  "Error connecting to Datalab Marker API:",
                  response.json
                );
                return false;
              }
            }
          }).catch((error) => {
            new import_obsidian.Notice("Error connecting to Datalab Marker API");
            console.error("Error connecting to Datalab Marker API:", error);
            return false;
          });
        } catch (error) {
          new import_obsidian.Notice("Error connecting t Datalabo Marker API");
          console.error("Error connecting to Datalab Marker API:", error);
          return Promise.resolve(false);
        }
      }
    } else {
      try {
        const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
        const parts = [];
        parts.push(
          `--${boundary}\r
Content-Disposition: form-data; name="pdf_file"; filename="test.pdf"\r
Content-Type: application/pdf\r
\r
`
        );
        parts.push(new Uint8Array(0));
        parts.push("\r\n");
        parts.push(
          `--${boundary}\r
Content-Disposition: form-data; name="extract_images"\r
\r
false\r
`
        );
        parts.push(`--${boundary}--\r
`);
        const bodyParts = parts.map(
          (part) => typeof part === "string" ? new TextEncoder().encode(part) : part
        );
        const bodyLength = bodyParts.reduce(
          (acc, part) => acc + part.byteLength,
          0
        );
        const body = new Uint8Array(bodyLength);
        let offset = 0;
        for (const part of bodyParts) {
          body.set(part, offset);
          offset += part.byteLength;
        }
        const requestParams = {
          url: `http://${this.settings.markerEndpoint}/convert`,
          method: "POST",
          body: body.buffer,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${boundary}`
          },
          throw: false
          // Don't throw on non-200 status codes
        };
        try {
          const response = await (0, import_obsidian.requestUrl)(requestParams);
          if (response.status !== 200) {
            new import_obsidian.Notice(`Error connecting to Marker API: ${response.status}`);
            console.error("Error connecting to Marker API:", response.status);
            return false;
          } else {
            if (!silent)
              new import_obsidian.Notice("Connection successful!");
            return true;
          }
        } catch (error) {
          new import_obsidian.Notice("Error connecting to Marker API");
          console.error("Error connecting to Marker API:", error);
          return false;
        }
      } catch (error) {
        new import_obsidian.Notice("Error connecting to Marker API");
        console.error("Error connecting to Marker API:", error);
        return Promise.resolve(false);
      }
    }
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var MarkerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("API endpoint").setDesc("Select the API endpoint to use").addDropdown(
      (dropdown) => dropdown.addOption("datalab", "Datalab").addOption("selfhosted", "Selfhosted").setValue(this.plugin.settings.apiEndpoint).onChange(async (value) => {
        this.plugin.settings.apiEndpoint = value;
        updateAPIKeySetting(value);
        await this.plugin.saveSettings();
      })
    );
    const endpointField = new import_obsidian.Setting(containerEl).setName("Marker API endpoint").setDesc("The endpoint to use for the Marker API.").addText(
      (text) => text.setPlaceholder("localhost:8000").setValue(this.plugin.settings.markerEndpoint).onChange(async (value) => {
        this.plugin.settings.markerEndpoint = value;
        await this.plugin.saveSettings();
      })
    ).addButton(
      (button) => button.setButtonText("Test connection").onClick(async () => {
        await this.plugin.testConnection(false);
      })
    );
    const apiKeyField = new import_obsidian.Setting(containerEl).setName("API Key").setDesc("Enter your Datalab API key").addText(
      (text) => {
        var _a;
        return text.setPlaceholder("API Key").setValue((_a = this.plugin.settings.apiKey) != null ? _a : "").onChange(async (value) => {
          this.plugin.settings.apiKey = value;
          await this.plugin.saveSettings();
        });
      }
    ).addButton(
      (button) => button.setButtonText("Test connection").onClick(async () => {
        await this.plugin.testConnection(false);
      })
    );
    const langsField = new import_obsidian.Setting(containerEl).setName("Languages").setDesc("The languages to use if OCR is needed, separated by commas").addText(
      (text) => {
        var _a;
        return text.setPlaceholder("en").setValue((_a = this.plugin.settings.langs) != null ? _a : "").onChange(async (value) => {
          this.plugin.settings.langs = value;
          await this.plugin.saveSettings();
        });
      }
    ).addButton(
      (button) => button.setButtonText("See supported languages").onClick(() => {
        new MarkerSupportedLangsDialog(this.app).open();
      })
    );
    const forceOCRToggle = new import_obsidian.Setting(containerEl).setName("Force OCR").setDesc(
      "Force OCR (Activate this when auto-detect often fails, make sure to set the correct languages)"
    ).addToggle(
      (toggle) => {
        var _a;
        return toggle.setValue((_a = this.plugin.settings.forceOCR) != null ? _a : false).onChange(async (value) => {
          this.plugin.settings.forceOCR = value;
          await this.plugin.saveSettings();
        });
      }
    );
    const paginateToggle = new import_obsidian.Setting(containerEl).setName("Paginate").setDesc("Add horizontal rules between each page").addToggle(
      (toggle) => {
        var _a;
        return toggle.setValue((_a = this.plugin.settings.paginate) != null ? _a : false).onChange(async (value) => {
          this.plugin.settings.paginate = value;
          await this.plugin.saveSettings();
        });
      }
    );
    new import_obsidian.Setting(containerEl).setName("New folder for each PDF").setDesc("Create a new folder for each PDF that is converted.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.createFolder).onChange(async (value) => {
        this.plugin.settings.createFolder = value;
        await this.plugin.saveSettings();
        updateMovePDFSetting(value);
      })
    );
    const movePDFToggle = new import_obsidian.Setting(containerEl).setName("Move PDF to folder").setDesc("Move the PDF to the folder after conversion").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.movePDFtoFolder).onChange(async (value) => {
        this.plugin.settings.movePDFtoFolder = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Create asset subfolder").setDesc("Create an asset subfolder for images").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.createAssetSubfolder).onChange(async (value) => {
        this.plugin.settings.createAssetSubfolder = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Extract content").setDesc("Select the content to extract from the PDF").addDropdown(
      (dropdown) => dropdown.addOption("all", "Extract everything").addOption("text", "Text Only").addOption("images", "Images Only").setValue(this.plugin.settings.extractContent).onChange(async (value) => {
        this.plugin.settings.extractContent = value;
        await this.plugin.saveSettings();
        updateWriteMetadataSetting(value);
      })
    );
    const writeMetadataToggle = new import_obsidian.Setting(containerEl).setName("Write metadata").setDesc("Write metadata as frontmatter in the markdown file").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.writeMetadata).onChange(async (value) => {
        this.plugin.settings.writeMetadata = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Delete original PDF").setDesc("Delete the original PDF after conversion.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.deleteOriginal).onChange(async (value) => {
        this.plugin.settings.deleteOriginal = value;
        await this.plugin.saveSettings();
      })
    );
    const updateMovePDFSetting = (createFolderEnabled) => {
      this.plugin.settings.movePDFtoFolder = false;
      movePDFToggle.settingEl.toggle(createFolderEnabled);
    };
    const updateWriteMetadataSetting = (extractContent) => {
      this.plugin.settings.writeMetadata = false;
      if (extractContent === "all" || extractContent === "text") {
        this.plugin.settings.writeMetadata = true;
      }
      writeMetadataToggle.settingEl.toggle(this.plugin.settings.writeMetadata);
    };
    const updateAPIKeySetting = (apiEndpoint) => {
      apiKeyField.settingEl.toggle(apiEndpoint === "datalab");
      langsField.settingEl.toggle(apiEndpoint === "datalab");
      forceOCRToggle.settingEl.toggle(apiEndpoint === "datalab");
      paginateToggle.settingEl.toggle(apiEndpoint === "datalab");
      endpointField.settingEl.toggle(apiEndpoint === "selfhosted");
    };
    updateAPIKeySetting(this.plugin.settings.apiEndpoint);
    updateMovePDFSetting(this.plugin.settings.createFolder);
    updateWriteMetadataSetting(this.plugin.settings.extractContent);
  }
};
var MarkerOkayCancelDialog = class extends import_obsidian.Modal {
  constructor(app, title, message, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
    this.title = title;
    this.message = message;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: this.title });
    contentEl.createEl("p", {
      text: this.message
    });
    const buttonContainer = contentEl.createEl("div", {
      attr: { class: "modal-button-container" }
    });
    const yesButton = buttonContainer.createEl("button", {
      text: "Okay",
      attr: { class: "mod-cta" }
    });
    yesButton.addEventListener("click", () => {
      this.result = true;
      this.onSubmit(true);
      this.close();
    });
    const noButton = buttonContainer.createEl("button", {
      text: "Cancel"
    });
    noButton.addEventListener("click", () => {
      this.result = false;
      this.onSubmit(false);
      this.close();
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};
var MarkerSupportedLangsDialog = class extends import_obsidian.Modal {
  constructor(app) {
    super(app);
    this.title = "Supported Languages";
    this.message = "To see the supported languages, please visit the following link:";
    this.link = "https://github.com/VikParuchuri/surya/blob/master/surya/languages.py";
    this.linkText = "Supported Languages (VikParuchuri/surya)";
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: this.title });
    contentEl.createEl("p", {
      text: this.message
    });
    contentEl.createEl("a", {
      text: this.linkText,
      attr: { href: this.link }
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};

/* nosourcemap */