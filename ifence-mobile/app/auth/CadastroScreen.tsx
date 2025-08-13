import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import Header from "@/components/Header";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import { spacing, moderateScale } from "../../utils/responsive";

const CadastroScreen = () => {
  const colors = useDaltonicColors();
  const [showSuccess, setShowSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleCriarConta = () => {
    if (username.trim() === "") {
      setUsernameError("O nome de usuário deve ser informado");
      return;
    }
    if (username.length < 4) {
      setUsernameError("O nome de usuário deve ter pelo menos 4 caracteres");
      return;
    }
    if (password.trim() === "") {
      setPasswordError("A senha precisa ser informada");
      return;
    }
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setShowSuccess(true);
  };

  return (
    <>
      <Header />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={() => setShowSuccess(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <Ionicons name="checkmark-circle" size={moderateScale(56)} color={colors.button} style={{ marginBottom: spacing(1) }} />
              <Text style={[styles.modalTitle, { color: colors.button }]}>Sucesso!</Text>
              <Text style={[styles.modalMessage, { color: colors.title }]}>Conta criada com sucesso!</Text>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.button }]}
                onPress={() => {
                  setShowSuccess(false);
                  router.replace("/auth/LoginScreen");
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.buttonText }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.btnBackPage}>
              <Image source={require("@/assets/images/ArrowBack.png")} />
            </TouchableOpacity>
          </Link>
          <Text style={[styles.titulo, { color: colors.title }]}>Criar conta</Text>
          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.title }]} accessibilityLabel="Nome de usuário obrigatório">Nome de usuário*</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.infoBox, color: colors.title, borderColor: colors.border },
                usernameError ? { borderColor: colors.button } : username ? { borderColor: colors.buttonText } : null,
              ]}
              placeholder="O nome de usuário deve ser informado"
              placeholderTextColor={colors.subtitle}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (text.trim() === "") {
                  setUsernameError("O nome de usuário deve ser informado");
                } else if (text.length < 4) {
                  setUsernameError("O nome de usuário deve ter pelo menos 4 caracteres");
                } else {
                  setUsernameError("");
                }
              }}
              accessibilityLabel="Campo para digitar o nome de usuário"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            {usernameError.length > 0 && (
              <Text style={[styles.errorText, { color: colors.button }]} accessibilityLiveRegion="polite">{usernameError}</Text>
            )}
            <Text style={[styles.label, { color: colors.title }]} accessibilityLabel="Senha obrigatória">Senha*</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  { backgroundColor: colors.infoBox, color: colors.title, borderColor: colors.border },
                  passwordError ? { borderColor: colors.button } : password ? { borderColor: colors.buttonText } : null,
                ]}
                placeholder="******"
                placeholderTextColor={colors.subtitle}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (text.trim() === "") {
                    setPasswordError("A senha precisa ser informada");
                  } else if (text.length < 6) {
                    setPasswordError("A senha deve ter pelo menos 6 caracteres");
                  } else {
                    setPasswordError("");
                  }
                }}
                accessibilityLabel="Campo para digitar a senha"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={moderateScale(20)} color={colors.title} />
              </TouchableOpacity>
            </View>
            {passwordError.length > 0 && (
              <Text style={[styles.errorText, { color: colors.button }]} accessibilityLiveRegion="polite">{passwordError}</Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: !username || !password || usernameError.length > 0 || passwordError.length > 0 ? colors.border : colors.button },
            ]}
            onPress={handleCriarConta}
            disabled={!username || !password || usernameError.length > 0 || passwordError.length > 0}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(2),
  },
  modalContent: {
    borderRadius: moderateScale(12),
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(2),
    alignItems: 'center',
    width: 300,
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: spacing(0.5),
  },
  modalMessage: {
    fontSize: moderateScale(14),
    marginBottom: spacing(1.5),
    textAlign: 'center',
  },
  modalButton: {
    borderRadius: moderateScale(8),
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2),
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: spacing(2),
  },
  btnBackPage: {
    alignSelf: "flex-start",
    marginBottom: spacing(1),
  },
  titulo: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: spacing(2),
    textAlign: "center",
  },
  label: {
    fontSize: moderateScale(14),
    marginBottom: spacing(0.5),
  },
  form: {
    marginBottom: spacing(2),
  },
  input: {
    borderRadius: moderateScale(8),
    padding: spacing(1.5),
    marginBottom: spacing(1),
    fontSize: moderateScale(14),
    borderWidth: 1,
  },
  inputError: {
    borderColor: '#E53935',
  },
  inputSuccess: {
    borderColor: '#4BB543',
  },
  errorText: {
    fontSize: moderateScale(12),
    marginBottom: spacing(1),
  },
  button: {
    borderRadius: moderateScale(8),
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    alignItems: "center",
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: spacing(4),
  },
  eyeIcon: {
    position: "absolute",
    right: spacing(1),
    top: spacing(1),
    padding: spacing(0.75),
  },
});
export default CadastroScreen;
