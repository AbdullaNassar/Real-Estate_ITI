export function extractPublicId(url) {
    url = url.split("?")[0]; // remove query params
    const parts = url.split("/");

    // remove version number if present (starts with "v" and digits)
    const versionPart = parts[parts.indexOf("upload") + 1];
    let folderParts;
    if (versionPart && /^v\d+$/.test(versionPart)) {
        folderParts = parts.slice(parts.indexOf("upload") + 2); 
    } else {
        folderParts = parts.slice(parts.indexOf("upload") + 1);
    }

    const filename = folderParts.pop(); // e.g. zvvt0cyaacbugxmupn0d.jpg
    const folder = folderParts.join("/"); // e.g. listings
    return folder ? folder + "/" + filename.split(".")[0] : filename.split(".")[0];
}