import { defineBackend } from "@aws-amplify/backend";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({ auth, data });
const api = backend.data.resources.graphqlApi;
const stack = Stack.of(api);

const source = api.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "bedrock",
    },
  }
);

source.grantPrincipal.addToPrincipalPolicy(new PolicyStatement({
  actions: ["bedrock:InvokeModel"],
  resources: [
    `arn:aws:bedrock:us-east-1:${stack.account}:inference-profile/us.anthropic.claude-haiku-4-5-20251001-v1:0`,
    "arn:aws:bedrock:us-*::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0",
  ],
}));
