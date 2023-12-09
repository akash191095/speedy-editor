import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { ChangeEvent, Key, useEffect, useRef, useState } from "react";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ImageUplaodRef = useRef<any>({});
  const [theme] = useTheme();

  useEffect(() => {
    const importComponent = async () => {
      // @ts-expect-error ignore
      const module = await import("@toast-ui/react-image-editor");
      const ModuleReactImageEditor = module.default.default;
      const maxHeight = window.innerHeight - 450;

      setReactImageEditor(
        <ModuleReactImageEditor
          className="flex-1"
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
              height: "100%",
            },
            menuBarPosition: "bottom",
          }}
          cssMaxHeight={maxHeight < 400 ? 400 : maxHeight}
          cssMaxWidth={window.innerWidth}
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

  function loadImage(event: ChangeEvent<HTMLInputElement>) {
    if (!ImageEditorRef.current.imageEditorInst) {
      return;
    }
    const file = event?.target?.files?.length ? event.target.files[0] : null;
    if (file) {
      ImageEditorRef.current.imageEditorInst.loadImageFromFile(file);
    }
  }

  function handleDownload() {
    if (!ImageEditorRef.current.imageEditorInst) {
      return;
    }
    const base64 = ImageEditorRef.current.imageEditorInst.toDataURL({
      format: "png",
    });
    fetch(base64).then(async (res) => {
      const blob = await res.blob();
      const uriContent = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", uriContent);
      link.setAttribute(
        "download",
        `${ImageEditorRef.current.imageEditorInst.getImageName()}-${Date.now().toString()}`,
      );
      const event = new MouseEvent("click");
      link.dispatchEvent(event);
    });
  }

  return (
    <div className="relative w-full flex flex-col min-h-[calc(100vh-64px)]">
      {ReactImageEditor}
      <div className="w-full bottom-3 right-3 z-10 flex justify-center gap-3 my-5">
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
        <Button onClick={() => ImageUplaodRef.current.click()}>Load</Button>
        <input
          onChange={loadImage}
          ref={ImageUplaodRef}
          type="file"
          id="file"
          name="file"
          hidden
        />
        <Button onClick={handleDownload}>Download</Button>
      </div>
    </div>
  );
}
