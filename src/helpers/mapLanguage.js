const languages = require("../language/languages.json")

const mapLanguage = (lang = "en", message = "Please check your data") => {
    if (languages[message] && languages[message][lang]) return languages[message][lang]
    if (languages[message] && languages[message]["en"]) return languages[message]["en"]
    return message

}

module.exports = {
    mapLanguage
}