---
title: github action
description: github action 原理，使用
date: 2024-01-11
tags:
  - 编程
  - github
categories:
  - 编程
---
## 简介
持续集成 (CI) 是一种需要频繁提交代码到共享仓库的软件实践。可以包括代码语法检查（检查样式格式）、安全性检查、代码覆盖率、功能测试及其他自定义操作。

[GitHub Actions](https://github.com/features/actions) 是 GitHub 的[持续集成服务](https://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)，每一步操作是一个单独的action（可以认为是一个脚本），将action进行组合，构建自己的发布工作流。工作流程可在 GitHub 托管的虚拟机或您自行托管的机器上运行。

公共存储库中标准 GitHub 托管的运行器和自托管运行器可免费使用 GitHub Actions。 对于专用存储库，每个 GitHub 帐户可获得一定数量的免费时间和存储以用于 GitHub 托管的运行器，具体取决于帐户的计划。 超出包含数量的任何使用量都由支出限制控制。

##  基本概念


1. **workflow** （工作流程）：持续集成一次运行的过程，就是一个 workflow。

2. **job** （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。

3. **step**（步骤）：每个 job 由多个 step 构成，一步步完成。

4. **action** （动作）：每个 step 可以依次执行一个或多个命令（action）。

5. **workflow**（工作流配置）：GitHub Actions 的配置文件叫做 workflow 文件，存放在代码仓库的`.github/workflows`目录，采用yml格式编写，一个库可以有多个 workflow 文件。GitHub 只要发现`.github/workflows`目录里面有`.yml`文件，就会自动运行该文件。

## 配置

```yml
# 工作流名称
name: GitHub Pages       

# 触发时机：定时，手动，指定操作等，可参考https://docs.github.com/zh/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows
# on字段也可以是事件的数组。 [push, pull_request]
on:
  push:
    branches:
      - main  # Set a branch to deploy
  pull_request:

# 要执行的任务
jobs:
  my-job:                        # 任务的`job_id`，具体名称自定义。
    name: My Job                 # 自定义名称
    runs-on: ubuntu-latest       # 所需要的虚拟机环境。它是必填字段
    steps:                       # 指定每个 Job 的运行步骤，可以包含一个或多个步骤
    - name: Print a greeting     # 步骤名称。

	  # 使用 `concurrency` 以确保只有使用相同并发组的单一作业或工作流才会同时运行。 并发组可以是任何字符串或表达式。
      concurrency:
        group: ${{ github.workflow }}-${{ github.ref }}
        
      env:                       # 环境变量，
        MY_VAR: Hi there! My name is
        FIRST_NAME: Mona
      
      if: ${{ github.ref == 'refs/heads/main' }}    # 除非满足条件，否则不运行。
      
      #输入给action的参数。 每个输入参数都是一个键/值对。 输入参数被设置为环境变量。
      with: 
	    github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./public 
      
      run: |                     
        echo $MY_VAR $FIRST_NAME $MIDDLE_NAME $LAST_NAME.

  job2:
    needs: my-job      # 依赖关系
  job3:
    needs: [job1, job2]     

```

## 常用action

### checkout

## 常见问题

1. push 代码403，权限被拒，需要在settings里为action开放写权限。