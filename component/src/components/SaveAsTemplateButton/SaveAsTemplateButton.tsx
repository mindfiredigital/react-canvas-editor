import React, { forwardRef, useEffect, useState } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { DOMEventHandlers } from "@harshita/canvas-editor";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
// import { DocumentService } from "../../services/documentService";
import { RootState } from "../../redux/store";
import { DocumentState } from "../../redux/documentReducer";
import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";

const SaveAsTemplateButton = forwardRef<HTMLDivElement>(function TemplateButton(
  _props,
  ref
) {
  const [image, setImage] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState();
  const doc = useSelector(
    (state: RootState) => state.document
  ) as DocumentState;

  useEffect(() => {
    //save image
    const formData = new FormData();
    const uploadimage = async () => {
      if (image) formData.append("image", image);
      // try {
      //   if (templateId) await DocumentService.uploadImage(templateId, formData);
      // } catch (err) {
      //   console.log(err);
      // }
    };
    if (templateId && image) uploadimage();
  }, [image, templateId]);

  const handleScreenshot = async () => {
    if (ref && "current" in ref && ref.current) {
      try {
        const canvas = ref.current;
        console.log(canvas);
        const screenshot = await html2canvas(canvas);

        const data = screenshot.toDataURL("image/png");
        setImage(data);
      } catch (error) {
        console.error("Error capturing screenshot:", error);
      }
    }
  };

  const handleClick = () => {
    const content = DOMEventHandlers.getContent();
    if (content) {
      handleScreenshot();
      const data: any = {
        userId: "user1",
        title: doc.title,
        data: content.data.main,
      }
      // DocumentService.saveAsTemplate(data).then(
      //   (resp) => {
      //     setTemplateId(resp.data.data);
      //   },
      //   (err) => {
      //     console.log(err);
      //   }
      // );
    }
  };
  return (
    <ButtonWrapper title="save as template" handleClick={handleClick}>
      <SaveAsIcon />
    </ButtonWrapper>
  );
});

export default SaveAsTemplateButton;
