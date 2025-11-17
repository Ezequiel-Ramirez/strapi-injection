/**
 * Global type declarations for Strapi admin customizations
 */

declare module '@strapi/design-system' {
  import { FC, ComponentType, ReactNode } from 'react';

  // Generic component type that accepts any props
  // This allows importing any component from the design system without TypeScript errors
  export const Button: ComponentType<any>;
  export const IconButton: ComponentType<any>;
  export const Box: ComponentType<any>;
  export const Flex: ComponentType<any>;
  export const Grid: ComponentType<any>;
  export const Typography: ComponentType<any>;
  export const TextInput: ComponentType<any>;
  export const Select: ComponentType<any>;
  export const Tabs: ComponentType<any>;
  export const Tab: ComponentType<any>;
  export const Table: ComponentType<any>;
  export const Thead: ComponentType<any>;
  export const Tbody: ComponentType<any>;
  export const Tr: ComponentType<any>;
  export const Td: ComponentType<any>;
  export const Th: ComponentType<any>;
  export const Dialog: ComponentType<any>;
  export const Icon: ComponentType<any>;
  export const Card: ComponentType<any>;
  export const CardHeader: ComponentType<any>;
  export const CardBody: ComponentType<any>;
  export const CardFooter: ComponentType<any>;
  export const ModalLayout: ComponentType<any>;
  export const ModalHeader: ComponentType<any>;
  export const ModalBody: ComponentType<any>;
  export const ModalFooter: ComponentType<any>;
  export const Pagination: ComponentType<any>;
  export const Badge: ComponentType<any>;
  export const Checkbox: ComponentType<any>;
  export const Option: ComponentType<any>;
  export const GridItem: ComponentType<any>;
  export const SingleSelect: ComponentType<any>;
  export const SingleSelectOption: ComponentType<any>;
  export const MultiSelect: ComponentType<any>;
  export const MultiSelectOption: ComponentType<any>;
  export const DatePicker: ComponentType<any>;
  export const Loader: ComponentType<any>;
  export const Alert: ComponentType<any>;
  export const Textarea: ComponentType<any>;

  // Add other components as needed
  // This pattern can be extended for any new component you use
}

declare module '@strapi/helper-plugin' {
  export const useNotification: () => (params: {
    type: 'success' | 'warning' | 'info';
    message: string;
  }) => void;
}
