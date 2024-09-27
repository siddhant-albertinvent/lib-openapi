const {axiosGetWithRetry} = require("./lib/async");
const config = require("../config");
const  GetCustomFields = async(service) => {
    try {
      const url = `${config.domain}/api/v3/customfields`;
      headers = {
        "Authorization": `Bearer ${config.token}`
      }

      options = {
        url,
        headers,
        params: {
          "service": service
        }
      }

      const result = await axiosGetWithRetry(options)
      if(!result) {
        throw new Error("No Data Found");
      }

      return result.Items;

    } catch(e) {
      throw new Error(e.message);
    }
}


module.exports = {GetCustomFields}