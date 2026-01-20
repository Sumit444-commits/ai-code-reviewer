import aiService from "../services/ai.service.js";

const getReview = async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) {
      return res.status(400).send("Prompt is required");
    }
    const response = await aiService(code);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export default {getReview} ;
