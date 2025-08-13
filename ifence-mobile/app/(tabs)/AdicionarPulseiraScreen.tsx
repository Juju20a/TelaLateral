import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import Header from "@/components/Header";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { useCercas } from "../../components/Cercas/hooks/useCercas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { spacing, moderateScale } from "../../utils/responsive";

type Pulseira = {
  id: string;
  nome: string;
  ativa: boolean;
  cercaId: string;
};

const AdicionarPulseiraScreen: React.FC = () => {
  const router = useRouter();
  const colors = useDaltonicColors();
  const [nomePulseira, setNomePulseira] = useState("");
  const [pulseiras, setPulseiras] = useState<Pulseira[]>([]);
  const [cercaSelecionada, setCercaSelecionada] = useState<string>("");
  // Buscar cercas reais do sistema
  const { cercas } = useCercas();
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomePulseira, setNovoNomePulseira] = useState("");

  const PULSEIRAS_STORAGE = "@pulseiras";

  // Funções de manipulação
  const adicionarPulseira = () => {
    if (!nomePulseira || !cercaSelecionada) {
      Toast.show({ type: "error", text1: "Preencha todos os campos!" });
      return;
    }
    const novaPulseira: Pulseira = {
      id: Math.random().toString(36).substr(2, 9),
      nome: nomePulseira,
      ativa: true,
      cercaId: cercaSelecionada,
    };
    const novasPulseiras = [...pulseiras, novaPulseira];
    setPulseiras(novasPulseiras);
    salvarPulseiras(novasPulseiras);
    setNomePulseira("");
    setCercaSelecionada("");
    Toast.show({ type: "success", text1: "Pulseira adicionada!" });
  };

  const iniciarEdicao = (index: number) => {
    setEditandoIndex(index);
    setNovoNomePulseira(pulseiras[index].nome);
    setCercaSelecionada(pulseiras[index].cercaId); // Setar cerca atual para edição
  };

  const cancelarEdicao = () => {
    setEditandoIndex(null);
    setNovoNomePulseira("");
    setCercaSelecionada(""); // Limpar seleção de cerca ao cancelar edição
  };

  const salvarEdicao = () => {
    if (editandoIndex === null) return;
    const novasPulseiras = [...pulseiras];
    novasPulseiras[editandoIndex].nome = novoNomePulseira;
    novasPulseiras[editandoIndex].cercaId = cercaSelecionada; // Atualizar cerca
    setPulseiras(novasPulseiras);
    salvarPulseiras(novasPulseiras);
    cancelarEdicao();
    Toast.show({ type: "success", text1: "Pulseira editada!" });
  };

  const deletarPulseira = (index: number) => {
    const novasPulseiras = pulseiras.filter((_, i) => i !== index);
    setPulseiras(novasPulseiras);
    cancelarEdicao();
    Toast.show({ type: "info", text1: "Pulseira excluída!" });
  };

  const alternarSwitch = (index: number, novoValor: boolean) => {
    const novasPulseiras = [...pulseiras];
    novasPulseiras[index].ativa = novoValor;
    setPulseiras(novasPulseiras);
  };

  const salvarPulseiras = async (pulseiras: Pulseira[]) => {
    try {
      await AsyncStorage.setItem(PULSEIRAS_STORAGE, JSON.stringify(pulseiras));
    } catch (error) {
      console.error("Erro ao salvar pulseiras:", error);
    }
  };

  const carregarPulseiras = async () => {
    try {
      const pulseirasSalvas = await AsyncStorage.getItem(PULSEIRAS_STORAGE);
      return pulseirasSalvas ? JSON.parse(pulseirasSalvas) : [];
    } catch (error) {
      console.error("Erro ao carregar pulseiras:", error);
      return [];
    }
  };

  useEffect(() => {
    const inicializarPulseiras = async () => {
      const pulseirasCarregadas = await carregarPulseiras();
      setPulseiras(pulseirasCarregadas);
    };
    inicializarPulseiras();
  }, []);

  // Removido mock de cercas, agora usa cercas reais do sistema

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.titulo, { color: colors.title }]}>Adicionar pulseira</Text>
          <View style={[styles.card, { backgroundColor: colors.infoBox, borderColor: colors.border }] }>
            <Text style={[styles.label, { color: colors.title }]}>Nome da pulseira:</Text>
            <TextInput
              style={[styles.input, { color: colors.title, borderColor: colors.border, backgroundColor: colors.background }]}
              value={nomePulseira}
              onChangeText={setNomePulseira}
            />
            <Text style={[styles.label, { color: colors.title }]}>Selecione uma cerca:</Text>
            <Picker
              selectedValue={cercaSelecionada}
              onValueChange={(itemValue) => setCercaSelecionada(itemValue)}
            >
              <Picker.Item label="Selecione uma cerca" value="" />
              {cercas.map((cerca, idx) => (
                <Picker.Item
                  key={String(cerca.id)}
                  label={cerca.nome}
                  value={String(cerca.id)}
                />
              ))}
            </Picker>
            <View style={styles.botoes}>
              <TouchableOpacity
                style={[styles.botaoAdicionar, { backgroundColor: colors.button }]}
                onPress={adicionarPulseira}
              >
                <Text style={[styles.textoBotao, { color: colors.buttonText }]}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoCancelar, { backgroundColor: colors.button }]}
                onPress={() => router.back()}
              >
                <Text style={[styles.textoBotao, { color: colors.buttonText }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.titulo, { color: colors.title }]}>Pulseiras Cadastradas:</Text>
          {pulseiras.map((item, index) => {
            const cercaAtribuida = cercas.find((cerca) => cerca.id === item.cercaId);
            return (
              <View key={item.id || index} style={[styles.card, { backgroundColor: colors.infoBox, borderColor: colors.border }] }>
                {editandoIndex === index ? (
                  <View style={[styles.cardEdicao, { backgroundColor: colors.infoBox, borderColor: colors.border }] }>
                    <TextInput
                      style={[styles.input, { color: colors.title, borderColor: colors.border, backgroundColor: colors.background }]}
                      value={novoNomePulseira}
                      onChangeText={setNovoNomePulseira}
                    />
                    <Picker
                      selectedValue={cercaSelecionada}
                      onValueChange={(itemValue) => setCercaSelecionada(itemValue)}
                    >
                      <Picker.Item label="Selecione uma cerca" value="" />
                      {cercas.map((cerca) => (
                        <Picker.Item key={cerca.id} label={cerca.nome} value={cerca.id} />
                      ))}
                    </Picker>
                    <View style={styles.botoes}>
                      <TouchableOpacity
                        style={[styles.botaoadd, { backgroundColor: colors.button }]}
                        onPress={salvarEdicao}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Salvar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botaoCancell, { backgroundColor: colors.button }]}
                        onPress={cancelarEdicao}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botaoExcluir, { backgroundColor: colors.button }]} 
                        onPress={() => deletarPulseira(index)}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => iniciarEdicao(index)}>
                    <Text style={[styles.item, { color: colors.title }]}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
                <Text style={[styles.cercaInfo, { color: colors.title }]}>
                  Cerca: {cercaAtribuida ? cercaAtribuida.nome : "Não atribuída"}
                </Text>
                <Switch
                  value={item.ativa}
                  onValueChange={(novoValor) => alternarSwitch(index, novoValor)}
                  trackColor={{ false: colors.infoBox, true: colors.button }}
                  thumbColor={item.ativa ? colors.button : colors.infoBox}
                />
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/Screens/ListarLocalizacoesPulseira",
                      params: { pulseiraId: item.id, cercaId: item.cercaId },
                    });
                  }}
                >
                  <Text style={[styles.textoBotaoVerLocalizacoes, { color: colors.title }] }>
                    Ver Localizações
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  cardEdicao: {
  padding: spacing(1.5),
  margin: spacing(1.25),
    borderWidth: 2,
  borderRadius: moderateScale(8),
  },
  container: {
    flex: 1,
  padding: spacing(2.5),
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backButton: {
  padding: spacing(1.25),
  },
  label: {
  fontSize: moderateScale(20),
    fontWeight: "600",
  marginBottom: spacing(1),
  },
  input: {
    borderWidth: 1,
  padding: spacing(1),
  fontSize: moderateScale(18),
  borderRadius: moderateScale(5),
  marginBottom: spacing(2.5),
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
  gap: spacing(1.5),
  },
  botaoAdicionar: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(2.5),
  borderRadius: moderateScale(4),
  },
  botaoCancelar: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(2.5),
  borderRadius: moderateScale(4),
  },
  botaoadd: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(1.875),
  borderRadius: moderateScale(6),
    flex: 1,
  maxWidth: moderateScale(120),
    alignItems: "center",
  marginHorizontal: spacing(0.625),
  marginBottom: spacing(1.25),
  },
  botaoExcluir: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(1.875),
  borderRadius: moderateScale(6),
    flex: 1,
    alignItems: "center",
  marginHorizontal: spacing(0.625),
  marginBottom: spacing(1.25),
  },
  botaoCancell: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(0.625),
  borderRadius: moderateScale(6),
    flex: 1,
  maxWidth: moderateScale(120),
  marginBottom: spacing(1.25),
  },
  textoBotao: {
  fontSize: moderateScale(18),
  },
  textoBotaoedit: {
    textAlign: "center",
  fontSize: moderateScale(11),
  },
  titulo: {
  fontSize: moderateScale(27),
    fontWeight: "600",
  marginVertical: spacing(1.25),
  },
  card: {
  padding: spacing(1.25),
  borderRadius: moderateScale(8),
    borderWidth: 1,
  marginBottom: spacing(2.5),
  },
  item: {
  fontSize: moderateScale(18),
  },
  textoBotaoVerLocalizacoes: {
  fontSize: moderateScale(17)
  },
  cercaInfo: {
  fontSize: moderateScale(14),
    color: "#555",
  },
});

export default AdicionarPulseiraScreen;
