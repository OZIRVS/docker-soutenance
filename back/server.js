const { CosmosClient } = require("@azure/cosmos");


const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = "SoutenanceDB";
const containerId = "Users";

const client = new CosmosClient({ endpoint, key });

app.get("/api/status", async (req, res) => {
  try {

    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    res.json({ success: true, database: "CosmosDB Connected" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  const { firstname } = req.body;
  try {
    const container = client.database(databaseId).container(containerId);
    const { resource: createdItem } = await container.items.create({ firstname });
    res.status(201).json({ success: true, id: createdItem.id, firstname });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});