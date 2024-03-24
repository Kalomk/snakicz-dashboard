import { Input } from '@chakra-ui/react';
import classNames from 'classnames';
import { ComponentProps, forwardRef, Ref } from 'react';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

interface FileUloaderOtherFields {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<any>;
  nameField: string;
}

type FileUploaderProps = ComponentProps<typeof Input> & FileUloaderOtherFields;

const FileUploader = forwardRef(({ ...props }: FileUploaderProps, ref: Ref<HTMLInputElement>) => {
  const handleFileUpload = async (
    event: HTMLInputEvent,
    setFieldValue: (arg0: string, arg1: Object) => void,
    nameField: string
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];

      setFieldValue(nameField, file); // Update the value of the file input field
    }
  };

  const { setFieldValue, name, ...rest } = props;
  return (
    <Input
      ref={ref}
      onChange={(event: HTMLInputEvent | any) => handleFileUpload(event, setFieldValue, name!)}
      className={classNames({
        // button colors
        'file:bg-gray-100 block file:text-white-500 hover:file:bg-gray-200': true,
        // button shape and spacing
        'file:rounded-lg p-0 file:rounded-tr-none file:rounded-br-none': true,
        'file:px-4 file:ml-{-10px} file:py-2  file:border-none': true,
        // overall input styling
        'hover:cursor-pointer border rounded-lg text-gray-400': true,
      })}
      {...rest}
    />
  );
});

FileUploader.displayName = 'FileUploader';
export default FileUploader;
