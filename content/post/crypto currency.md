---
title: 加密货币
description: 加密货币简介，原理
date: 2024-01-11
tags:
  - 区块链
  - 比特币
categories:
  - 经济
image: https://backblaze.gxprayer.cn/2025/02/%E6%AF%94%E7%89%B9%E5%B8%81icon.png
---
## 一、定义

**加密货币**：
1. 使用加密技术来保护交易的虚拟货币。它没有中央发行或监管机构，而是使用<font color="#ff0000">去中心化</font>系统（区块链）来记录交易并发行新货币。
2. 加密货币运行在称为区块链的分布式公共分类账上，这是货币持有者更新和持有的所有交易的记录。
3. 拥有加密货币，不会拥有任何有形的东西，而是有一个密钥，它允许在没有受信任的第三方的情况下，将记录或度量货币从一个人移动到另一个人。

**区块链**
1. 区块链技术源于比特币，其本质是一个不断增长的全网总账本，它是由多个区块构成的有序链表，每一个区块都记录了一系列交易（第一个记录通常为矿工奖励），并且，每个区块都指向前一个区块，从而形成一个链条。
2. 每个区块都有一个唯一的哈希标识，被称为区块哈希，同时，区块通过记录上一个区块的哈希来指向上一个区块，每一个区块还有一个Merkle哈希用来确保该区块的所有交易记录无法被篡改。
3. 网络中每个完全节点都拥有完整的区块链数据。并且，节点总是信任最长的区块链，伪造区块链需要拥有超过51%的全网算力。

**挖矿**
1. 在比特币的区块链网络中，有一类节点在不停地进行计算，试图把新的交易打包成新的区块并附加到区块链上，这类节点就是矿工。每打包一个新区块，该矿工就可以获得一笔比特币作为奖励。
2. 比特币的挖矿原理就是一种工作量证明机制。工作量证明POW是英文Proof of Work的缩写。
3. 根据比特币每个区块的难度值和产出时间，就可以推算出整个比特币网络的全网算力。当前约750EH/s（7.5万亿亿）
4. 一个交易可能被打包到一个后续被孤立的区块中（两个矿工同时算出一个区块）。所以，要确认一个交易被永久记录到区块链中，需要对交易进行确认。如果后续的区块被追加到区块链上，实际上就会对原有的交易进行确认。
	1. 孤链上的交易作废，钱退回。
	2. 此时的交易可能会遭受 **双花攻击**：攻击者向商家发送交易，商家确认后发货。同时，攻击者在另一条链上发起一笔冲突交易，将同一笔比特币发送给自己。如果攻击者成功让冲突交易所在的链成为主链，那么商家的交易将被撤销，导致损失。
	3. 链越长，修改难度越大。经过6个区块确认的交易几乎是不可能被修改的。

**区块链Layer-2**
1. Layer 2指基于 Layer 1 区块链的链下网络、系统或技术，目的是扩展底层区块链。Layer 2网络可以提升任何底层区块链的吞吐量以及其他性能。
2. 区块链一层的基础能力：公开透明、去中心化、安全性、计算能力、性能（吞吐量）、存储、隐私等。为满足特定的需求， Layer 2区块链对基础能力进行取舍，会降低一些特性，甚至丢弃一些特性，而换取某些特性的显著提高。
	1. 一些二层为了提高性能，会降低去中心化的程度，会降低安全性；
	2. 一些二层为了增加吞吐量，如闪电网络，会改变系统的结构和结算的方式。
	3. 一些会不降低基础特性的前提下，增强了某种特性，例如 RGB 的处理方式，明显增加了隐私性和抗审查性，但增加了技术实现难度。
3. Layer 2网络有一个共同点，那就是在结算时都会向底层区块链提交某种可验证的加密证明，以证明状态变更的真实性。
4. 主要技术路线：
	1. **状态通道**：让用户建立端到端加密的通道，促进了两个或多个参与方之间的多次链下交易，确保只有第一笔和最后一笔交易会记录在比特币区块链中，而无需将每笔交易都广播到主区块链。可以实现以尽可能低的 gas 费用，支持更大的交易吞吐量。
	2. **侧链**： 侧链是与主链并行运行但是分开的、独立的区块链，允许用户将资产（比特币）从主区块链转移到侧链。当比特币转移到侧链后，用户可以使用这些资产进行智能合约、代币发行或实现新的共识机制。侧链会验证比特币主区块链上的信息并执行后续操作。
	3. **Rollup**：将多个链下交易从主比特币链移到一个独立网络，处理后，再将一笔压缩后的交易提交回链上。与侧链不同的是，Rollup 会定期将区块提交到主链上，从而继承主链的安全性和去中心化特性，但平均交易处理量一般不如侧链。

**以太坊**
1. 以太坊（Ethereum）是一个支持智能合约的区块链平台，和比特币类似，以太坊也通过PoW进行挖矿，后改为PoS挖矿，其挖出的平台币叫以太币，它与比特币最大的不同是，以太坊通过一个虚拟机（EVM）可以运行智能合约。
2. 以太坊账户负责存储用户的以太坊余额。对大多数普通用户（非合约账户）来说，以太坊账户和银行账户非常类似，用私钥控制。账户由4部分数据构成：
	1. `nonce`：一递增整数，记录的是交易次数，每次交易`nonce` + `1`。
	2. `balance`：记录的就是账户余额，以`wei`为单位，1 Ether等于10<sup>18</sup>`wei`。
	3. 外部账户 `storageRoot`  `codeHash` 是空的。
3. 以太坊存储账户数据的数据结构是MPT：Merkle Patricia Tree，它是一种改进的Merkle Tree。
4. 一个以太坊区块由区块头和一系列交易构成。区块头除了记录parentHash（上一个区块的Hash）、stateRoot（世界状态）外，还包括：
	- sha3Uncles：记录引用的叔块；
	- transactionRoot：记录当前区块所有交易的Root Hash；
	- receiptsRoot：记录当前区块所有交易回执的Root Hash；
	- logsBloom：一个Bloom Filter，用于快速查找Log；
	- difficulty：挖矿难度值；
	- number：区块高度，严格递增的整数；
	- timestamp：区块的时间戳（以秒为单位）；
5. 和比特币不同，分叉时，针对竞争失败的区块，以太坊鼓励后续的区块引用此废弃的区块，这种引用的废弃块被称为叔块（Uncle Block）。

## 二、演变

[layer2演变](https://www.jinse.cn/blockchain/3665810.html)

## 三、实际项目

**虚拟币**
- **比特币**  
	- 最初的虚拟货币，2025年币值10万美元左右。
	- 应用场景广泛，可直接购买ETF，暗网交易，甚至在一些国家可直接消费。
- 以太币  
	- 比特币后，以太坊平台的本地加密货币。币值稳定在3000左右。                
	- 应用场景次于比特币。
- 狗狗币 
	- 起初是作为一种搞笑的加密货币而创建的，但随著时间的推移逐渐获得了一定的社区支持和市场认可。 


**Layer2**
- 闪电网络
	- 一个建立在比特币上的Layer2解决方案，旨在解决比特币的可扩展性和低交易速度的问题。于 2015 年首次提出，并在 2018 年全面实施。
	- 特点：快速、低成本和可扩展。它通过建立一系列的支付通道，使得比特币交易可以在通道内部进行，而不需要直接记录在区块链上。大大减少交易确认时间和交易费用，并支持大量并行交易。
- Liquid
	- 于 2015 年推出的一个侧链解决方案。旨在提供更快速、安全和私密的交易解决方案，以满足金融机构和交易平台等专业用户的需求。
	- 特点：
		- **快速的交易确认时间**。相比于比特币的确认时间约为 10 分钟，Liquid 的交易确认时间只需 2 分钟。使得用户能够更快地进行交易。
		- **交易私密性**。Liquid 采用了 Confidential Transactions（机密交易）技术，使得交易金额得以隐藏，只有交易的参与方能够查看具体金额。
		- **具备更高的交易吞吐量**。通过使用 Federated Peg（联邦锚定）技术，Liquid 能够支持大量并行的交易，并在比特币网络上进行锚定，实现与比特币的互操作性。
- Rootstock
	- 是一个建立在比特币上的智能合约平台，旨在为比特币生态系统提供类似以太坊的功能。
	- 主要特点是与比特币的双向锚定和智能合约功能。通过与比特币的双向锚定，Rootstock 能够使用比特币作为其主要资产，实现安全性和稳定性。同时，Rootstock 支持智能合约功能，使开发者能够在其平台上构建和执行具有自动化功能的智能合约。


**交易所**
**加密货币交易所**是一种业务，允许客户将"加密货币"与其他资产进行交易。


## 四、虚拟币交易

### 比特币
 1. 比特币的交易是一种无需信任中介参与的P2P（Peer-to-peer）交易。交易记录的是双方的公钥地址。
 2. 比特币实际的交易记录是由一系列交易构成，每一个交易都可包含多个或一个输入（Input）或多个或一个输出（Output）。比特币协议规定一个输出必须<font color="#ff0000">一次性花完</font>。
	 1. **UTXO（Unspent Transaction Output，未花费交易输出）** 是比特币网络中用于跟踪比特币所有权和转移的核心机制。每笔交易的输出都会生成新的 UTXO，这些 UTXO 可以被后续的交易作为输入花费。
	 2. **示例**：假设 Alice 想发送 0.5 BTC 给 Bob。以下是交易的步骤：
		 1. Alice 之前收到了一笔交易，生成了一个 UTXO，价值 1 BTC。
		 2. **创建交易** 
			 1. **输入**：Alice 花费她的 1 BTC UTXO。
		 3. **输出**：
			 1. 0.5 BTC 发送给 Bob（生成一个新的 UTXO）。
			 2. 0.49 BTC 返回给 Alice 作为找零（生成另一个新的 UTXO）。
			 3. 0.01 BTC 作为交易费支付给矿工（不生成 UTXO，直接被销毁）。
		 4. **交易后的 UTXO**：
			 1.  Alice 的 1 BTC UTXO 被花费，从 UTXO 集合中移除。
			 2. 两个新的 UTXO 被创建：Bob 的 0.5 BTC UTXO；Alice 的 0.49 BTC UTXO。
	 3. **特性**：
		 1.  **不可分割性**：每个 UTXO 必须被一次性全部花费，不能部分花费。
		 2. **全局唯一性**： 每个 UTXO 都有一个唯一的标识符。
		 3. **透明性**： UTXO 状态都是公开的，任何人都可以查看比特币区块链来验证 UTXO 的存在和所有权。

 3. 私钥本质是256位随机整数，以16进制表示共64字符，32字节，对私钥进行Base58编码，得到私钥地址，又称为钱包导入格式：WIF。（Bech32编码得到Segwit地址，可防范延展性攻击）。
 4. 公钥根据私钥计算得出，不能根据公钥逆向计算私钥。比特币的地址并不是公钥，而是公钥的哈希。即从公钥能推导出地址，但从地址不能反推公钥。用户可以生成任意数量的密钥对，公钥是接收别人转账的地址，私钥是花费比特币唯一手段。
 5. 和银行账户不同，比特币网络没有账户的概念，任何人都可以从区块链查询到任意公钥对应的比特币余额，但不知道这些公钥由谁持有的，也无法根据用户查询比特币余额。但是可以看到公钥地址有多少货币。
 6. <font color="#ff0000">比特币钱包</font>用于发送和接收比特币，其实际上是帮助用户管理私钥的软件，钱包程序须从创世区块开始扫描每一笔交易，钱包的当前余额总是钱包地址关联的所有UTXO金额之和。
 7. 交易过程使用。
 8. 比特币交易的输出是一个<font color="#ff0000">锁定脚本</font>，锁定脚本中引入了收款方的地址，而下一个交易的输入是一个解锁脚本，必须由本UXTO拥有者的私钥创建。输入有效，就可以花费该输出。
 9. 为了避免一个私钥的丢失导致地址的资金丢失，比特币引入了<font color="#ff0000">多重签名机制</font>，可以实现分散风险的功能。具体来说，就是假设N个人分别持有N个私钥，只要其中M个人同意签名就可以动用某个“联合地址”的资金。

### 以太坊
1. 以太坊除了最基本的转账：即从一个账户支付Ether到另一个账户，还支持执行合约代码。合约代码是图灵完备的编程语言，通过EVM（以太坊虚拟机）执行。
2. 在以太坊中，交易也需要手续费，手续费被称为Gas（汽油），它的计算比比特币要复杂得多。交易费等于总gasUsed * gasPrice。
3. <font color="#ff0000">gasUsed</font>：为保证合约代码的可靠执行，以太坊给每一个虚拟机指令都标记了一个Gas基本费用。
4. <font color="#ff0000">gasPrice</font>：以Gwei（1Gwei=10<sup>9</sup>Wei）为单位。
5. 一笔交易，先给出gasPrice和gasLimit，如果执行完成后有剩余，剩余的退还，如果执行过程中消耗殆尽，那么交易执行失败，但已执行的Gas不会退。
6. 交易回执：以太坊区块每笔交易都会产生一笔回执（Recipt），表示交易的最终状态。包括：
	1. status：执行结果，1表示成功，0表示失败；
	2. gasUsed：已消耗的Gas数量；
	3. txHash：交易Hash；
	4. ....

## 使用

## 注意事项