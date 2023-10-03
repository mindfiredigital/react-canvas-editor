import { TAskAI } from "../utils/types";
import API from "./api";

export const AskAIService = {
  askAI: ({ endpoint, payload }: TAskAI) => {
    return API.post(`/askai/${endpoint}`, payload);
  },
};
