// CSS modules
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Image modules
declare module "*.png" {
  const content: string;
  export default content;
}
