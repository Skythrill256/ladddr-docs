import fs from 'fs';
import path from 'path';
import { visit } from 'unist-util-visit';
import { u } from 'unist-builder';
import remarkGfm from 'remark-gfm';
import createMDX from '@next/mdx';
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx';
import rehypeSlug from 'rehype-slug';

// Read and parse the JSON file
const docsFilePath = path.resolve('./configs/docs.json');
const docsData = JSON.parse(fs.readFileSync(docsFilePath, 'utf8'));

const { dataArray } = docsData;

const chConfig = {
  components: { code: 'PreCode' },
};

function rehypeComponent() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'mdxJsxFlowElement' && node.name === 'TabCodePreview') {
        const nameAttribute = node.attributes.find(
          (attr) => attr.name === 'name'
        );
        const name = nameAttribute ? nameAttribute.value : null;

        if (!name) {
          console.log('No name found for TabCodePreview');
          return;
        }

        try {
          const currentComponentData = dataArray.reduce((acc, section) => {
            const component = section.componentArray.find(
              (comp) => comp.componentName === name
            );
            if (component) {
              return component;
            }
            return acc;
          }, null);

          if (!currentComponentData) {
            console.error(`Component not found: ${name}`);
            return;
          }

          const filesContent =
            currentComponentData.filesArray?.map((file) => {
              const filePath = path.join(process.cwd(), file.filesrc);
              const source = fs.readFileSync(filePath, 'utf8');
              return {
                name: file.name,
                content: source,
                path: file.filesrc,
                componentName: currentComponentData.componentName,
              };
            }) || [];

          node.children = filesContent.map((file) =>
            u('element', {
              tagName: 'PreCode',
              properties: {
                codeblock: JSON.stringify(file.content),
                filename: file.name,
                componentname: file.componentName,
              },
              children: node.children,
            })
          );
        } catch (error) {
          console.error(`Error processing component ${name}:`, error);
        }
      }
      if (
        node.type === 'mdxJsxFlowElement' &&
        node.name === 'DrawerCodePreview'
      ) {
        const nameAttribute = node.attributes.find(
          (attr) => attr.name === 'name'
        );
        const name = nameAttribute ? nameAttribute.value : null;

        if (!name) {
          console.log('No name found for CodePreview');
          return;
        }

        try {
          const currentComponentData = dataArray.reduce((acc, section) => {
            const component = section.componentArray.find(
              (comp) => comp.componentName === name
            );
            if (component) {
              return component;
            }
            return acc;
          }, null);

          if (!currentComponentData) {
            console.error(`Component not found: ${name}`);
            return;
          }

          const filePath = path.join(
            process.cwd(),
            `./registry/${currentComponentData.filesrc}`
          );
          const source = fs.readFileSync(filePath, 'utf8');

          node.children = [
            u('element', {
              tagName: 'PreCode',
              properties: {
                codeblock: JSON.stringify(source),
                comName: currentComponentData.componentName,
                filesrc: currentComponentData.filesrc,
              },
              children: node.children,
            }),
          ];
        } catch (error) {
          console.error(`Error processing component ${name}:`, error);
        }
      }
    });
  };
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, [remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
    rehypePlugins: [rehypeSlug, rehypeComponent],
    jsx: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
      },
      {
        hostname: 'res.cloudinary.com',
      },
      {
        hostname: 'images.unsplash.com',
      },
      {
        hostname: 'img.freepik.com',
      },
    ],
  },
};

export default withMDX(nextConfig);
