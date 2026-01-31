import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

interface DocOptions {
  content: string;
  filename?: string;
  jobTitle?: string;
  company?: string;
}

export const downloadDocx = async ({ content, filename, jobTitle, company }: DocOptions) => {
  // Simple parser to handle paragraphs from text
  const paragraphs = content.split('\n').map(line => {
    // Basic Markdown stripping (optional but helpful)
    const cleanLine = line.replace(/\*\*/g, '').replace(/^#+\s/, '');

    // Check if line is empty
    if (!cleanLine.trim()) return new Paragraph({});

    return new Paragraph({
        children: [
            new TextRun({
                text: cleanLine,
                size: 24, // 12pt
                font: "Calibri",
            }),
        ],
        spacing: {
            after: 200, // spacing after paragraph
        },
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
            ...(jobTitle && company ? [
                new Paragraph({
                    text: `Cover Letter - ${jobTitle} at ${company}`,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                })
            ] : []),
            ...paragraphs
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const name = filename || `Cover_Letter_${company || 'Generated'}.docx`;
  saveAs(blob, name);
};
