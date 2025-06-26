import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const fileUri = FileSystem.documentDirectory + 'picoles.txt';

type Picole = {
  id: number;
  nome: string;
  preco: string;
  sabor: string;
  quantidade: string;
};

export default function App() {
  const [picoles, setPicoles] = useState<Picole[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [sabor, setSabor] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [idSelecionado, setIdSelecionado] = useState<number | null>(null);

  useEffect(() => {
    carregarDoArquivo();
  }, []);

  const salvarEmArquivo = async (dados: Picole[]) => {
    try {
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(dados));
    } catch (err) {
      console.error('Erro ao salvar: ', err);
    }
  };

  const carregarDoArquivo = async () => {
    try {
      const conteudo = await FileSystem.readAsStringAsync(fileUri);
      const dados: Picole[] = JSON.parse(conteudo);
      setPicoles(dados);
    } catch (err) {
      console.log('Nenhum dado salvo ainda ou erro ao ler:', err);
    }
  };

  const limparCampos = () => {
    setNome('');
    setPreco('');
    setSabor('');
    setQuantidade('');
    setIdSelecionado(null);
  };

  const adicionarOuAtualizarPicole = () => {
    if (!nome || !preco || !sabor || !quantidade) return;

    if (idSelecionado !== null) {
      // Atualizar
      const atualizados = picoles.map(p =>
        p.id === idSelecionado
          ? { id: idSelecionado, nome, preco, sabor, quantidade }
          : p
      );
      setPicoles(atualizados);
      salvarEmArquivo(atualizados);
    } else {
      // Criar
      const novoId = picoles.length > 0 ? picoles[picoles.length - 1].id + 1 : 1;
      const novoPicole: Picole = { id: novoId, nome, preco, sabor, quantidade };
      const atualizados = [...picoles, novoPicole];
      setPicoles(atualizados);
      salvarEmArquivo(atualizados);
    }

    limparCampos();
  };

  const editarPicole = (picole: Picole) => {
    setIdSelecionado(picole.id);
    setNome(picole.nome);
    setPreco(picole.preco);
    setSabor(picole.sabor);
    setQuantidade(picole.quantidade);
  };

  const excluirPicole = (id: number) => {
    const atualizados = picoles.filter(p => p.id !== id);
    setPicoles(atualizados);
    salvarEmArquivo(atualizados);
    if (id === idSelecionado) limparCampos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Picolé na Praia</Text>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Sabor" value={sabor} onChangeText={setSabor} />
      <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />

      <View style={styles.buttonContainer}>
        <Button title={idSelecionado !== null ? 'Atualizar Picolé' : 'Cadastrar Picolé'} onPress={adicionarOuAtualizarPicole} />
      </View>

      <ScrollView>
        {picoles.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text>Sabor: {item.sabor}</Text>
            <Text>Preço: R$ {item.preco}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity onPress={() => editarPicole(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirPicole(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#FFE3E8',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FE758F',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FE758F',
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2A9D8F',
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#E63946',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});