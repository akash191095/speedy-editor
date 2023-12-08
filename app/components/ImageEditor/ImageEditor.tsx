import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Key, useEffect, useRef, useState } from "react";

import "tui-image-editor/dist/tui-image-editor.css";
import { IMAGE_EDITOR_PRESETS } from "~/utils/constants";
import { Theme, useTheme } from "~/utils/theme-provider";

import darkTheme from "./theme/dark-theme";
import lightTheme from "./theme/light-theme";

const preset = [
  { label: "Add Timestamp", value: IMAGE_EDITOR_PRESETS.ADD_TIME_STAMP },
  { label: "Flip Vertically", value: IMAGE_EDITOR_PRESETS.FLIP_Y },
  { label: "Flip Horizontally", value: IMAGE_EDITOR_PRESETS.FLIP_X },
];

export default function ImageEditor() {
  const [ReactImageEditor, setReactImageEditor] =
    useState<null | React.ReactNode>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ImageEditorRef = useRef<{ imageEditorInst: any }>({
    imageEditorInst: null,
  });

  const [theme] = useTheme();

  useEffect(() => {
    const importComponent = async () => {
      // @ts-expect-error ignore
      const module = await import("@toast-ui/react-image-editor");
      const ModuleReactImageEditor = module.default.default;
      setReactImageEditor(
        <ModuleReactImageEditor
          ref={ImageEditorRef}
          includeUI={{
            loadImage: {
              path: "bg1.jpg",
              name: "SampleImage",
            },
            theme: theme === Theme.DARK ? darkTheme : lightTheme,
            menu: ["text", "crop", "shape"],
            initMenu: "",
            uiSize: {
              width: "100%",
              height: "700px",
            },
            menuBarPosition: "bottom",
          }}
          cssMaxHeight={400}
          cssMaxWidth={1200}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics={false}
        />,
      );
    };

    importComponent();
  }, []);

  function handlePresetChange(value: Key): void {
    if (!ImageEditorRef.current.imageEditorInst) {
      return;
    }
    switch (value) {
      case IMAGE_EDITOR_PRESETS.ADD_TIME_STAMP:
        ImageEditorRef.current.imageEditorInst.addText(
          new Date().toLocaleString(),
          {
            styles: {
              fontSize: 40,
              fill: "yellow",
            },
          },
        );
        break;
      case IMAGE_EDITOR_PRESETS.FLIP_Y:
        ImageEditorRef.current.imageEditorInst
          .flipY()
          .catch((message: string) => {
            console.log("error: ", message);
          });
        break;
      case IMAGE_EDITOR_PRESETS.FLIP_X:
        ImageEditorRef.current.imageEditorInst
          .flipX()
          .catch((message: string) => {
            console.log("error: ", message);
          });
        break;
      default:
        break;
    }
  }

  return (
    <div className="relative">
      {ReactImageEditor}
      <div className="dark absolute w-80 bottom-3 right-3 z-10 flex justify-end">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Add Preset</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Actions" onAction={handlePresetChange}>
            {preset.map((preset) => (
              <DropdownItem key={preset.value}>{preset.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
