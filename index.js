const {GetCustomFields} = require("./src/apiCall");

const getItemFromPath = (swaggerDocument, path) => {
  const pathParts = path.split('.').filter(Boolean);
  return pathParts.reduce((acc, part) => {
      if (acc === undefined) {
          return undefined;
      }
      if (!isNaN(part)) {
          return acc[parseInt(part)];
      } else {
          return acc[part];
      }
  }, swaggerDocument);
};
const findCustomFlags = (obj, path = '') => {
  let customFlags = [];
  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (key.startsWith('x-')) {
              customFlags.push({ path: `${path}`, key, value });
          }
          if (typeof value === 'object' && value !== null) {
              customFlags = customFlags.concat(findCustomFlags(value, `${path}.${key}`));
          }
      }
  }
  return customFlags;
};

const extractCustomFieldsEnum = async(service) => {
  const items = await GetCustomFields(service)
  return items.map(item => ([`Metadata.${item.name}`].join(",")));
}


const UpdateDynamicContent = async (swaggerDocument) => {
  const customFlags = findCustomFlags(swaggerDocument, "");

  // Use for...of to handle async/await inside the loop
  for (const flag of customFlags) {
    if (flag.key === "x-enum-enable") {
      const enumConfig = flag.value;
      console.log(enumConfig);
      let enumValue;

      // Check if the source is "customFields"
      if (enumConfig.source === "customFields") {
        // Use await to fetch enum value asynchronously
        enumValue = await extractCustomFieldsEnum(enumConfig.params.service);
      }

      // Get the specific item from the document and update it
      const docItem = getItemFromPath(swaggerDocument, flag.path);
      if (docItem) {
        docItem['enum'] = enumValue;
        console.log(docItem);
      }
    }
  }

  return swaggerDocument;
};

module.exports = {UpdateDynamicContent}