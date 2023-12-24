import fs from "fs";
import path from "path";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type Fields, type Files, IncomingForm } from "formidable";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != "POST") {
    res.status(404).json({ message: "not found" }); // @todo: figure out status code and error messages
  }
  try {
    const data: {
      fields: Fields<string>;
      files: Files<string>;
    } = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    const id = data.fields.id?.[0];
    const images = data.files.image;
    const publicFolderPath = path.join(
      process.cwd(),
      "public",
      "img",
      "barang",
    );
    console.log(publicFolderPath);
    if (
      images?.[0]?.originalFilename &&
      images[0].mimetype == "image/png" &&
      images[0].size <= MAX_FILE_SIZE &&
      id
    ) {
      const oldPath = images[0].filepath;
      const newPath = path.join(
        publicFolderPath,
        id + "." + images[0].originalFilename.split(".").pop() ?? "",
      );

      try {
        await fs.promises.copyFile(oldPath, newPath);
        res.status(200).json({ message: "success" });
      } catch (err) {
        console.error("[upload-gambar.ts] failed copying image");
      }
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (err) {
    console.error("[upload-gambar.ts] failed parsing form");
    res.status(500).json({ message: "internal server error" });
  }
}
