const Agents = require("../../../models/realEstateAgent");

exports.createAgentPage = async (req, res) => {
  try {
    const { title, description , ...restOfData } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "All fields are requird!!" });
    }
    const existing = await Agents.findOne({ title });
    if (existing) {
      return res.status(400).json({ message: "Real Estate Agent already exists!!" });
    }
    const agent = await Agents.create({
      title,
      description,
      ...restOfData
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Real Estate Agent created successfully !",
        data: agent,
      });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
exports.getAgentPage = async (req, res) => {
  try {
    const agent = await Agents.find();
    if (!agent) return res.status(404).json({ message: "Real Estate agent not found!!" });
    res.json(agent);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agents.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found!!" });
    res.json(agent);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agents.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ success: true, message: "Agent update successfully!!", agent });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agents.findByIdAndDelete(id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res
      .status(200)
      .json({ success: true, message: "Agent deleted successfully!!!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
