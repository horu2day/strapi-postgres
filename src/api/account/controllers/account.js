// src/api/account/controllers/account.js

"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::account.account", ({ strapi }) => ({
  async findOne(ctx) {
    try {
      const { id } = ctx.params;

      // Use strapi.entityService to fetch the entity
      const entity = await strapi.entityService.findOne(
        "api::account.account",
        id,
        {
          ...ctx.query, // Include any query parameters if necessary
        }
      );

      if (!entity) {
        return ctx.notFound("Account not found");
      }

      const modifiedData = {
        id: entity.id,
        attributes: {
          documentId: entity.documentId,
          name: entity.name,
          balance: entity.balance,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          publishedAt: entity.publishedAt,
        },
      };

      // Return the modified data
      return ctx.send({ data: modifiedData });
    } catch (error) {
      strapi.log.error("Error in findOne controller:", error);
      return ctx.internalServerError("Internal Server Error");
    }
  },
}));
