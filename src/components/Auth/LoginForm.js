import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import useLoading from "../../hooks/useLoading";
import Header from "../Header";
import Button from "../Button";
import { Link } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AsyncStorageStatic } from "react-native";

export default function LoginForm(props) {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [logging, setLogging] = useState(false);
  //const { loading } = useLoading();

  //let navigation = useNavigation();

  /*useEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
      swipeEnabled: false,
      gestureEnabled: false,
    });
    const stackNavigator = navigation.dangerouslyGetParent();
    //console.log(stackNavigator.dangerouslyGetParent());
    if (stackNavigator) {
      stackNavigator.setOptions({
        tabBarVisible: false,
        swipeEnabled: false,
        gestureEnabled: false,
      });
    }
  }, [auth, navigation]);*/

  /*useEffect(() => {
    (async () => {
      await loadUserData();
    })();
  }, [login]);*/

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object(validationSchema()),
    validateOnChange: false,

    onSubmit: async () => {
      setLogging(true);
      setError("");

      try {
        const response = await fetch(
          "https://pasteblock.herokuapp.com/api/login",
          {
            method: "POST",
            body: JSON.stringify(formik.values),
          }
        );
        const result = await response.json();
        setLogging(false);
        console.log(result);

        if (result.success) {
          login(result.success, result.email, result.nombre, result.context);
        } else {
          setError("Email o contraseña incorrectos");
        }

        return result;
      } catch (error) {
        throw error;
      }
    },
  });

  /*
  const loadUserData = async () => {
    try {
      const response = await getAuthUserApi({ userData }.userData);
      setUserAuthData(response);
      setNombre({ userAuthData }.userAuthData.nombre);
    } catch (error) {
      console.log(error);
    }
  };*/

  return (
    <View style={{ backgroundColor: "blue", height: "100%" }}>
      <Header />
      <Text style={styles.title}>Blockers</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={formik.values.email}
        onChangeText={(text) => formik.setFieldValue("email", text)}
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry={true}
        value={formik.values.password}
        onChangeText={(text) => formik.setFieldValue("password", text)}
      />

      <Button
        title="Iniciar sesión"
        onPress={formik.handleSubmit}
        backgroundColor="white"
        textColor="blue"
      />

      <View style={styles.spinner}>
        {logging ? <ActivityIndicator size="large" color="white" /> : <></>}
      </View>

      <Text style={styles.error}>{formik.errors.email}</Text>
      <Text style={styles.error}>{formik.errors.password}</Text>
      <Text style={styles.error}>{error}</Text>
      <Text style={styles.text}>
        ¿No tienes cuenta?{" "}
        <Link style={styles.link} to="/Signup">
          Regístrate aquí
        </Link>
      </Text>
    </View>
  );
}

function validationSchema() {
  return {
    email: Yup.string()
      .email("El email no es válido")
      .required("Ingrese un email"),
    password: Yup.string()
      .required("Ingrese una contraseña")
      .min(
        8,
        "La contraseña es muy corta, debe tener 8 caracteres como mínimo"
      ),
  };
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    color: "white",
  },
  input: {
    height: 40,
    marginBottom: 25,
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
  link: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  spinner: {},
  error: {
    textAlign: "center",
    marginTop: 20,
    color: "#f00",
  },
});
