# GeoBrowser Schema: Education Evidence Dossier

This folder describes a compact graph schema for loading the Education Evidence Dossier into GeoBrowser or a Geo-compatible graph workflow.

The live Geo testnet API exposes entities as snapshots with:
- `values`: property values, each keyed by `propertyId` and `spaceId`
- `relations`: typed edges with `typeId`, `fromEntityId`, `toEntityId`, `spaceId`, optional `position`, and optional `verified`
- `blocks`: content blocks attached to an entity

The CSV files here use stable local keys instead of permanent Geo UUIDs. After creating the schema in a Geo space, fill the `geo_*_id` columns with the assigned UUIDs and use the templates to transform `content/*.json` into entity and relation imports.

## Files

- `schema-manifest.csv`: ordered list of schema files and what each one defines.
- `spaces.csv`: target Geo space metadata.
- `entity-types.csv`: entity type definitions for the dossier.
- `property-types.csv`: reusable property definitions and Geo value types.
- `relation-types.csv`: graph edge definitions between entity types.
- `entities.csv`: populated graph entities generated from the live app content.
- `values.csv`: populated property values generated from the live app content.
- `relations.csv`: populated graph edges generated from the live app content.
- `entity-template.csv`: row shape for entity imports generated from the JSON content.
- `relation-template.csv`: row shape for relation imports generated from the JSON content.
- `mapping.md`: how the current `content/*.json` files map into graph nodes and edges.
- `api-notes.md`: practical notes from the Geo testnet API shape.

## Recommended Load Order

1. Create or select the target Geo space.
2. Create entity types from `entity-types.csv`.
3. Create property types from `property-types.csv`.
4. Create relation types from `relation-types.csv`.
5. Generate entities using `entity-template.csv`.
6. Generate relations using `relation-template.csv`.

Keep the schema small at first. The main value of this graph is connecting debates, initiatives, sources, methods, outcomes, and evidence claims without flattening the evidence into a single table.

## Regenerating Populated CSVs

Run this after `content/*.json` changes:

```bash
node scripts/generate-geobrowser-csvs.mjs
```

The generator writes `entities.csv`, `values.csv`, and `relations.csv`.
