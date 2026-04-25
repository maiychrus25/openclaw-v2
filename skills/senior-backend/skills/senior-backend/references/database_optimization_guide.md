# Database Optimization Guide

This guide covers MongoDB and general NoSQL optimization strategies.

## 1. The ESR Rule for Indexing

When creating Compound Indexes, always follow the **ESR Rule**:
1. **[E]quality**: Fields that are matched precisely (e.g., `status: 'active'`)
2. **[S]ort**: Fields used to order the results (e.g., `createdAt: -1`)
3. **[R]ange**: Fields used in range filters (e.g., `$gt`, `$lt`, `$in`)

**Example:**
Query: `db.orders.find({ status: 'active', amount: { $gt: 100 } }).sort({ createdAt: -1 })`
Index: `db.orders.createIndex({ status: 1, createdAt: -1, amount: 1 })`

## 2. Preventing COLLSCAN (Collection Scans)

Collection scans destroy performance on large datasets.
- Always use `db.collection.explain('executionStats')` to analyze queries.
- Look for `totalDocsExamined` vs `nReturned`. If `totalDocsExamined` is much larger than `nReturned`, your index is inefficient.

## 3. Solving the N+1 Problem

The N+1 query problem occurs when you query a list of items, and then for each item, you make another database query to fetch related data.

### Solution 1: Aggregation Pipeline (`$lookup`)
Perform the join within the database engine.
```javascript
db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'customerDetails'
    }
  }
])
```

### Solution 2: Application-level Batching (DataLoader)
If using GraphQL or separate microservices, use Facebook's `DataLoader` pattern to batch and cache multiple requests for the same entity into a single `db.users.find({ _id: { $in: userIds } })`.

## 4. Data Modeling Principles (Embedding vs Referencing)

**The most important principle is:** Structure your data to match the ways that your application queries and updates data.
Identify the questions that arise from your application’s use cases first, and then model your data so that the questions can get answered in the most efficient way.

### General Guidelines
- **Favor Embedding:** In general, always favor embedding, unless there is a good reason not to embed. Especially apply this on **1:FEW** and **1:MANY** relationships.
- Use embedding when data is mostly read but rarely updated, and when two datasets belong intrinsically together.
- **Favor Referencing:** A **1:TON** or a **MANY:MANY** relationship is usually a good reason to reference instead of embedding.
- Also, favor referencing when data is updated a lot and if you need to frequently access a dataset on its own.

### Managing Array Growth
- **Don't allow arrays to grow indefinitely!**
- If you need to normalize data:
  - Use **child referencing** for **1:MANY** relationships.
  - Use **parent referencing** for **1:TON** relationships.
  - Use **two-way referencing** for **MANY:MANY** relationships.

## 5. Partial & Sparse Indexes

In NoSQL, many fields are optional. Use **Partial Indexes** to only index documents where the field exists, saving RAM.
```javascript
db.users.createIndex(
  { email: 1 }, 
  { partialFilterExpression: { email: { $exists: true } }, unique: true }
)
```

## 6. Resource Limits
- Always use `.limit()` on `.find()`. Never return unbounded arrays.
- Implement pagination at the DB level, not the application level.
