import { AlgorandClient } from "@algorandfoundation/algokit-utils";

export const algorand = AlgorandClient.fromConfig({
  algodConfig: {
    server: "https://testnet-api.algonode.cloud",
    port: "",
    token: "",
  },
});


// import { AlgorandClient } from "@algorandfoundation/algokit-utils";

// /**
//  * TestNet configuration
//  * Uses Algonode public endpoint (no token required)
//  */
// export const algorand = AlgorandClient.fromConfig({
//   algodConfig: {
//     server: "https://testnet-api.algonode.cloud",
//     port: "",
//     token: "",
//   },
// });
