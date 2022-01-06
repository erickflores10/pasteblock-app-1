import React, { useState, Fragment } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Button";
import UploadImage from "../Uploads/UploadImage";
import mime from "mime";
import axios from "axios";
import BlockerProfile from "./BlockerProfile";
import useReg from "../../hooks/useReg";

export default function BlockerDataForm() {
  const [dataState, updateState] = useState("");
  const { reg } = useReg();
  const [photo, setPhoto] = useState(true);

  const handler = (data) => {
    updateState(data);
  };

  console.log({ dataState });
  const formik = useFormik({
    initialValues: {
      foto: "",
    },
    validationSchema: Yup.object(validationSchema()),
    validateOnChange: false,

    onSubmit: async () => {
      console.log({ dataState });

      let formData = new FormData();

      formData.append("file", {
        uri:
          Platform.OS === "android"
            ? dataState.image
            : dataState.image.replace("file://", ""),
        name: dataState.image.split("/").pop(),
        type: mime.getType(dataState.image),
      });

      const url = "https://pasteblock.herokuapp.com/api/blocker/form/" + reg;
      //const url = "http://localhost:8080/api/blocker/form/8";
      console.log("aaaaaaaaa");
      console.log(url);
      console.log("aaaaaaaaaaa");

      try {
        const response = await fetch(
          url,
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        //const response = await axios.post(url, formData);
        const result = await response.json();
        console.log(result);
        if (result) {
          setPhoto(false);
          console.log(photo);
        }
        return result;
      } catch (error) {
        throw error;
      }
    },
  });
  return (
    <View style={{ backgroundColor: "blue", height: "100%" }}>
      <Text style={styles.title}>Registro</Text>
      { photo ? <Fragment><UploadImage someHandlerProp={handler} /><Button
        title="Subir foto"
        onPress={formik.handleSubmit}
        backgroundColor="white"
        textColor="blue"
      /></Fragment> : <BlockerProfile blockerId={reg} />
      }
    </View>
  );
}

function validationSchema() {
  return {};
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 45,
    marginBottom: 15,
    color: "white",
  },
  input: {
    height: 40,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    width: "80%",
    alignSelf: "center",
    color: "black",
  },
  text: {
    textAlign: "center",
    color: "white",
  },
  error: {
    textAlign: "center",
    marginTop: 10,
    color: "#f00",
  },
});
