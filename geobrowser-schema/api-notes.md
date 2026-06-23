# Geo Testnet API Notes

The Geo testnet API at `https://testnet-api.geobrowser.io/openapi` describes an entity-value-relation graph.

## Relevant API Shapes

`EntitySnapshot` includes:

- `id`: entity UUID
- `values`: array of `VersionedValue`
- `relations`: array of `VersionedRelation`
- `blocks`: array of block snapshots

`VersionedValue` includes:

- `propertyId`
- `spaceId`
- one typed value field such as `text`, `boolean`, `integer`, `float`, `decimal`, `date`, `datetime`, `point`, or `embedding`
- optional contextual fields

`VersionedRelation` includes:

- `relationId`
- `typeId`
- `fromEntityId`
- `toEntityId`
- `spaceId`
- optional `position`
- optional `verified`

## Search

The `/search` endpoint supports query search with optional:

- `scope`
- `space_id`
- `additional_space_ids`
- `type_ids`
- `exclude_type_ids`
- `limit`
- `offset`
- `include_non_canonical`

That means the CSV schema should preserve type IDs after creation. Search and filtering become much easier when `entity-types.csv`, `property-types.csv`, and `relation-types.csv` are filled with the assigned Geo UUIDs.

## Import Posture

The public OpenAPI exposes read/search/versioned/proposal/IPFS endpoints, but not a simple CSV upload endpoint for creating graph entities directly. Treat these CSVs as an authoring and transformation contract:

1. Create schema entities and relation types in the Geo space.
2. Fill `geo_*_id` columns with assigned UUIDs.
3. Transform dossier JSON into entity and relation rows.
4. Use the appropriate Geo edit/proposal flow for publishing changes.

This keeps the schema portable even if the final write path is through the GeoBrowser UI, a proposal workflow, or an SDK.
