import { blockchainResponseType } from "../../common/types/blockchainResponseTypes";

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chainCodeName = process.env.CHAINCODE_NAME || "chaincode";
const PORT = process.env.BLOCKCHAIN_PORT || "4000";
const fetchFcn = process.env.FETCH_FUNCTION || "getHash";
const postFcn = process.env.POST_FUNCTION || "postHash";
const putFcn = process.env.PUT_FUNCTION || "putHash";
const historyFcn = process.env.HISTORY_FUNCTION || "getHistory";
const blockchainAccessToken =
  process.env.BLOCKCHAIN_ACCESS_TOKEN || "your_access_token_here";

export const blockchainFetchByKey = async (
  key: string,
  history: boolean = false
): Promise<blockchainResponseType> => {
  try {
    const encodedArgs = encodeURIComponent(`["${key}"]`);
    const fcn = history ? historyFcn : fetchFcn;

    const url = `http://localhost:${PORT}/channels/${channelName}/chaincodes/${chainCodeName}?fcn=${fcn}&args=${encodedArgs}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${blockchainAccessToken}`,
      },
    });
    const data: blockchainResponseType = await response.json();

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch by key: ${key}. Error: ${data.error}, Error Data: ${data.errorData}`
      );
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch by key: ${error}`);
    throw new Error(`Failed to fetch by key: ${error}`);
  }
};

export const blockchainPostPut = async (
  inputData: Map<string, any>,
  isPut: boolean = false
): Promise<blockchainResponseType> => {
  try {
    const url = `http://localhost:${PORT}/channels/${channelName}/chaincodes/${chainCodeName}`;
    const args = inputData.entries().next().value;

    const response = await fetch(url, {
      body: JSON.stringify({
        fcn: isPut ? putFcn : postFcn,
        args: args,
      }),
      method: isPut ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${blockchainAccessToken}`,
      },
    });

    const data: blockchainResponseType = await response.json();
    if (response.status !== 201) {
      throw new Error(
        `Failed to ${isPut ? "put" : "post"} data. Error: ${
          data.error
        }, Error Data: ${data.errorData}`
      );
    }
    return data;
  } catch (error) {
    console.error(`Failed to ${isPut ? "put" : "post"} data: ${error}`);
    throw new Error(`Failed to ${isPut ? "put" : "post"} data: ${error}`);
  }
};
