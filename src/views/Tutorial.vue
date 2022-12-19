<template>
  <div>
    <w3q-tip bgColor="#2F6FFF" fontColor="#ffffff" />
    <b-navbar-item tag="div" class="connect-wallet">
      <a class="button is-primary" :active="true" @click="onConnectWallet">
        <strong>{{ this.connectWalletMessage }}</strong>
      </a>
    </b-navbar-item>
    <section class="hero is-medium">
      <div class="hero-body">
        <div class="">
          <p class="title">Web3Q Quick Start</p>
          <p class="subtitle">Create Your First dWeb in 5 Mins</p>
        </div>
      </div>
    </section>

    <div class="container block" style="margin-top: 1vw; max-width: 685px">
      <section style="font-weight: lighter">
        <b-field label="Step 1: choose the network">
          <b-tooltip
            label="Initial testnet (chain ID 3333)"
            type="is-light"
            position="is-bottom"
          >
            <b-radio
              v-model="chain"
              native-value="testnet"
              @input="clearAccount"
            >
              Testnet
            </b-radio>
          </b-tooltip>
          <b-tooltip
            label="Galileo is our second testnet (chain ID 3334)"
            type="is-light"
            position="is-bottom"
          >
            <b-radio
              v-model="chain"
              native-value="galileo"
              @input="clearAccount"
            >
              Galileo
            </b-radio>
          </b-tooltip>
          <b-tooltip label="Coming soon" type="is-light" position="is-bottom">
            <b-radio
              v-model="chain"
              native-value="mainnet"
              disabled
              @input="clearAccount"
            >
              Mainnet
            </b-radio>
          </b-tooltip>
        </b-field>


        <p v-if="network !== 'mainnet'" style="text-align: left">
          You can get test tokens from our
          <a :href="faucetUrl" target="_blank">faucet</a>.
        </p>
        <br />


        <b-field
          v-show="chain === 'testnet'"
          label="Step 2: claim your domain"
          type="is-success"
          :message="claimMessage"
        >
          <b-input
            v-model="domainToClaim"
            placeholder="Domain name"
            expanded
          ></b-input>
          <p class="control">
            <span class="button is-static">.w3q</span>
          </p>
          <p class="control" @click="onClaim">
            <b-button type="is-primary" label="Claim" />
          </p>
        </b-field>
        <b-field
          v-show="chain === 'galileo'"
          label="Step 2: register your domain"
        >
          <p style="text-align: left">
            Go to
            <a href="https://galileo.web3q.io/w3ns.w3q/" target="_blank">W3NS</a>
            or
            <a href="https://ens.domains/" target="_blank">ENS</a>
            to register your domain name.
          </p>
        </b-field>
        <br />


        <b-field
          label="Step 3: deploy your web handler"
          type="is-success"
          :message="deployMessage"
        >
          <p class="control">
            <button
              class="button is-primary is-outlined is-fullwidth"
              @click="onDeploy"
            >
              Deploy
            </button>
          </p>
        </b-field>
        <br />


        <b-field
          label="Step 4: link your web handler to your domain"
          type="is-success"
          :message="linkMessage"
        >
          <b-input
            v-model="claimedDomain"
            placeholder="Domain"
            style="max-width: 125px"
          ></b-input>
          <p class="control">
            <b-dropdown v-model="isW3q" aria-role="list">
              <template v-if="isW3q" #trigger>
                <b-button type="is-primary">
                  <span>.w3q</span>
                  <font-awesome-icon style="color: #ffffff; margin-left: 8px; margin-bottom: 2px"
                                     :icon="['fas', 'fa-sort-down']"/>
                </b-button>
              </template>
              <template v-else #trigger>
                <b-button type="is-primary">
                  <span>.eth</span>
                  <font-awesome-icon style="color: #ffffff; margin-left: 8px; margin-bottom: 2px"
                                     :icon="['fas', 'fa-sort-down']"/>
                </b-button>
              </template>

              <b-dropdown-item :value="true" aria-role="listitem">
                <div class="media">
                  <div class="media-content">
                    <h3>.w3q</h3>
                  </div>
                </div>
              </b-dropdown-item>
              <b-dropdown-item :value="false" aria-role="listitem">
                <div class="media">
                  <div class="media-content">
                    <h3>.eth</h3>
                  </div>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </p>
          <b-input
            v-model="deployedHandler"
            placeholder="Handler contract address: 0x1234..."
            class="code"
            expanded
          ></b-input>
          <p class="control">
            <b-button type="is-primary" label="Link" @click="onLink" />
          </p>
        </b-field>
        <br />


        <label class="label">Step 5: write content to your web handler</label>
        <b-field label="Handler contract address" label-position="on-border">
          <b-input
            v-model="deployedHandler"
            placeholder="0x1234...."
            class="code"
          ></b-input>
        </b-field>
        <b-field label="File name" label-position="on-border">
          <b-input
            v-model="fileName"
            placeholder="hello.txt, index.html, etc."
          ></b-input>
        </b-field>
        <br />


        <b-field
          label="Content"
          label-position="on-border"
          style="margin-bottom: 0px"
        >
          <b-input v-model="content" maxlength="2000" type="textarea"></b-input>
        </b-field>
        <b-field type="is-success" :message="writeContentMessage">
          <button
            class="button is-primary is-outlined is-fullwidth"
            @click="onWrite"
          >
            Write
          </button>
        </b-field>
        <br />


        <label class="label">Step 6: browse your website and share!</label>
        <div v-if="written" class="box showcase-box">
          Your dWeb should be live on
          <a :href="url" target="_blank" rel="noopener noreferrer">{{
            this.url
          }}</a>
        </div>
      </section>
      <b-loading
        v-model="isLoading"
        :is-full-page="false"
        :can-cancel="true"
      ></b-loading>
    </div>
    <Footer color="#000000" class="footer-layout" />
  </div>
</template>
<script>
import { ethers } from "ethers";
import Footer from "@/views/Footer";
import namehash from "eth-ens-namehash";
import { parseTerm } from "@/utils/Search";

const nameServiceContractInfo = {
  mainnet: {},
  testnet: {
    address: "0x5095135E861845dee965141fEA9061F38C85c699",
    abi: [
      "function claimBy(bytes memory name) public",
      "function setPointer(bytes32 node, address addr) public",
    ],
  },
  galileo: {
    address: "0x076B3e04dd300De7db95Ba3F5db1eD31f3139aE0",
    abi: ["function setWebHandler(bytes32 node, address handler) external"],
  },
  ethereum: {
    address: "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
    abi: [
       "function resolver(bytes32 node) public view returns (address)",
       "function setText(bytes32 node, string calldata key, string calldata value) external",
    ],
  },
  rinkeby: {
    address: "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
    abi: [
      "function resolver(bytes32 node) public view returns (address)",
      "function setText(bytes32 node, string calldata key, string calldata value) external",
    ],
  },
};
const directoryFactoryContractInfo = {
  mainnet: {},
  testnet: {
    address: "0x7906895532c9Fc4D423f3d5E78672CAd3EB44F91",
    abi: ["function create() public returns (address)"],
  },
  galileo: {
    address: "0x1CA0e8be165360296a23907BB482c6640D3aC6ad",
    abi: ["function create() public returns (address)"],
  },
};
const directoryContractABI = [
  "function write(bytes memory filename, bytes memory data) public payable",
];

const stringToHex = (s) => ethers.utils.hexlify(ethers.utils.toUtf8Bytes(s));

export default {
  name: "Tutorial",
  components: {
    Footer,
  },
  data() {
    return {
      currentAccount: null,
      chain: "galileo",
      network: "galileo",
      domainToClaim: "",
      claimed: false,
      claimedDomain: "",
      deployed: false,
      deployedHandler: "",
      linked: false,
      fileName: "",
      content: "",
      written: false,
      isLoading: false,
      isW3q: true,
    };
  },
  async created() {
    window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    window.ethereum.on("chainChanged", (chainId) => {
      let network = { "0xd05": "testnet", "0xd06": "galileo" }[chainId];
      if (!network) {
        if (this.chain === "galileo" && (chainId === "0x1" || chainId === "0x4")) {
          // link ens
          if(chainId === "0x4") {
            network = "rinkeby";
          } else {
            network = "ethereum";
          }
        } else {
          alert("unsupported network");
          this.network = "";
          return;
        }
      }
      if (network !== this.network) {
        this.network = network;
      }
    });
    setTimeout(this.onConnectWallet, 1000);
  },
  methods: {
    async onConnectWallet() {
      if (this.currentAccount) {
        return;
      }
      if (!window.ethereum) {
        alert("please install metamask");
        return;
      }

      const networks = {
        testnet: [
          "0xd05",
          "Web3Q Testnet",
          "https://testnet.web3q.io:8545/",
          "https://explorer.testnet.web3q.io/",
        ],
        galileo: [
          "0xd06",
          "Web3Q Galileo Testnet",
          "https://galileo.web3q.io:8545/",
          "https://explorer.galileo.web3q.io/",
        ],
        mainnet: [
          "0x14d",
          "Web3Q",
          "https://mainnet.web3q.io:8545/",
          "https://explorer.mainnet.web3q.io/",
        ],
      };
      const [chainId, chainName, rpc, explorer] = networks[this.network];
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId,
                  chainName,
                  rpcUrls: [rpc],
                  nativeCurrency: {
                    name: "Web3Q",
                    symbol: "W3Q",
                    decimals: 18,
                  },
                  blockExplorerUrls: [explorer],
                },
              ],
            });
          } catch (error) {
            console.log(error);
            alert(error.message);
            return;
          }
        }
      }

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(this.handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("user rejected.");
          } else {
            console.error(err);
          }
        });
    },
    handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        this.currentAccount = null;
        console.warn(
          "MetaMask is locked or the user has not connected any accounts"
        );
        return;
      }
      if (accounts[0] !== this.currentAccount) {
        this.currentAccount = accounts[0];
      }
    },
    clearAccount() {
      this.network = this.chain;
      this.currentAccount = null;
      this.onConnectWallet();
    },

    async switchLinkChain() {
      if (this.isW3q) {
        if (this.network !== "galileo") {
          return await this.changeToGalileo();
        }
      } else {
        if (this.network !== "ethereum" && this.network !== "rinkeby") {
          return await this.changeToEth();
        }
      }
      return true;
    },
    async changeToEth() {
      if (this.network !== "ethereum") {
        const chainId = "0x1";
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId}],
          });
          this.network = "ethereum";
          return true;
        } catch (switchError) {
          return false;
        }
      }
      return true;
    },
    async changeToGalileo() {
      if (this.network !== "galileo") {
        const chainId = "0xd06";
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId}],
          });
          this.network = "galileo";
          return true;
        } catch (e) {
          return false;
        }
      }
      return true;
    },

    async onClaim() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // TODO: validation and stuff
      const domainInBytes = stringToHex(this.domainToClaim);
      const nsContract = new ethers.Contract(
        nameServiceContractInfo[this.network].address,
        nameServiceContractInfo[this.network].abi,
        provider
      );
      const contractWithSigner = nsContract.connect(provider.getSigner());
      const receipt = await this._doTx(() =>
        contractWithSigner.claimBy(domainInBytes)
      );
      if (receipt) {
        this.claimedDomain = this.domainToClaim;
        this.claimed = true;
      }
    },
    async onDeploy() {
      if (this.chain === "galileo" && this.network !== "galileo") {
        const value = await this.changeToGalileo();
        if (!value) {
          return;
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const dirFactoryContract = new ethers.Contract(
        directoryFactoryContractInfo[this.network].address,
        directoryFactoryContractInfo[this.network].abi,
        provider
      );
      const contractWithSigner = dirFactoryContract.connect(
        provider.getSigner()
      );
      const receipt = await this._doTx(contractWithSigner.create);
      if (receipt) {
        this.deployedHandler = `0x${receipt.events[0].data.slice(-40)}`;
        this.deployed = true;
      }
    },
    async onLink() {
      if (this.chain === "galileo") {
        const value = await this.switchLinkChain();
        if (!value) {
          return;
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // TODO: validation and stuff
      const nsContract = new ethers.Contract(
        nameServiceContractInfo[this.network].address,
        nameServiceContractInfo[this.network].abi,
        provider
      );
      const contractWithSigner = nsContract.connect(provider.getSigner());

      let domain, action;
      if (this.network === "testnet") {
        domain = stringToHex(this.claimedDomain);
        domain = domain + "0".repeat(66 - domain.length);
        action = contractWithSigner.setPointer;
      } else if (this.network === "galileo") {
        // w3ns
        const domainName = `${this.claimedDomain}.w3q`;
        const inputType = parseTerm(domainName, 'w3q');
        if (!['unsupported', 'invalid', 'short'].includes(inputType)) {
          domain = namehash.hash(domainName);
          action = contractWithSigner.setWebHandler;
        } else {
          alert("Domain format error!");
          return;
        }
      } else if(this.network === "ethereum" || this.network === "rinkeby") {
        // ens
        const domainName = `${this.claimedDomain}.eth`;
        const inputType = parseTerm(domainName, 'eth');
        if (!['unsupported', 'invalid', 'short'].includes(inputType)) {
          domain = namehash.hash(inputType);
          const resolver = await nsContract.resolver(domain);
          const resolverContract = new ethers.Contract(resolver, nameServiceContractInfo[this.network].abi, provider);
          const resolverContractWithSigner = resolverContract.connect(provider.getSigner());
          action = resolverContractWithSigner.setText;

          const receipt = await this._doTx(() =>
              action(domain, "web3", `w3q-g:${this.deployedHandler}`)
          );
          if (receipt) {
            this.linked = true;
          }
          return;
        } else {
          alert("Domain format error!");
          return;
        }
      } else {
        alert("network not supported");
        return;
      }

      const receipt = await this._doTx(() =>
        action(domain, this.deployedHandler)
      );
      if (receipt) {
        this.linked = true;
      }
    },
    async onWrite() {
      if (this.chain === "galileo" && this.network !== "galileo") {
        const value = await this.changeToGalileo();
        if (!value) {
          return;
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // TODO: validation and stuff
      const dirContract = new ethers.Contract(
        this.deployedHandler,
        directoryContractABI,
        provider
      );
      const contractWithSigner = dirContract.connect(provider.getSigner());
      const receipt = await this._doTx(() =>
        contractWithSigner.write(
          stringToHex(this.fileName),
          stringToHex(this.content)
        )
      );
      if (receipt) {
        this.written = true;
      }
    },
    async _doTx(txFunc) {
      try {
        const tx = await txFunc();
        this.isLoading = true;
        const receipt = await tx.wait();
        return receipt;
      } catch (error) {
        alert(
          (error.data && error.data.message) ||
            error.message ||
            "failed to interact with contract"
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    claimMessage() {
      return this.claimed && this.claimedDomain
        ? `Domain "${this.claimedDomain}" has been successfully claimed`
        : "";
    },
    deployMessage() {
      return this.deployed && this.deployedHandler
        ? `Handler deployed at ${this.deployedHandler}`
        : "";
    },
    linkMessage() {
      return this.linked
        ? `Handler at ${this.deployedHandler} has been linked with domain ${this.claimedDomain}`
        : "";
    },
    writeContentMessage() {
      return this.written
        ? `Your content has been written to ${this.fileName}`
        : "";
    },
    url() {
      if(this.chain === "galileo") {
        if (this.linked) {
          if (this.isW3q) {
            return `https://galileo.web3q.io/${this.claimedDomain}.w3q/${this.fileName}`
          } else if (this.network === "rinkeby") {
            return `https://galileo.web3q.io/${this.claimedDomain}.eth:4/${this.fileName}`
          } else {
            return `https://galileo.web3q.io/${this.claimedDomain}.eth/${this.fileName}`
          }
        }
        return `https://galileo.web3q.io/${this.deployedHandler}:3334/${this.fileName}`
      }
      return `https://${this.network}.web3q.io/${this.claimedDomain || "<your w3ns domain>"}.w3q/${this.fileName}`;
    },
    faucetUrl() {
      return `https://${this.network}.web3q.io/faucet.w3q/faucet.html`;
    },
    connectWalletMessage() {
      if (!this.currentAccount) {
        return "Connect Wallet";
      }
      const addr = ethers.utils.getAddress(this.currentAccount);
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    },
  },
};
</script>

<style>
.showcase-box {
  text-align: left;
  font-family: "Segoe UI", Helvetica, Arial, sans-serif;
  font-weight: normal;
}
.code input {
  font-family: Courier, monospace;
}
.connect-wallet {
  position: absolute;
  right: 0px;
}
.footer-layout {
  margin-top: 140px;
}
</style>
