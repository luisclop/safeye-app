import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable,FlatList  } from "react-native";
import useReports from "../hooks/useReports";
import { Report } from "../types";
import moment from 'moment';

export function IncidentsScreen() {
  const [seeAdmonished, setSeeAdmonished] = useState(true);
  const reportList = useReports();

  const renderAdmonishedItem = ({ item, index }: { item: Report; index: number }) => {
    
    return (
      <View style={styles.listItem}>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemNumber}>{index + 1}.</Text>
          <View style={styles.listItemInfo}>
            <Text style={styles.listItemEPPs}>
              {item.EPPs.length > 0 ? item.EPPs.join(", "): "Formulario manual"}
            </Text>
            <Text style={styles.listItemArea}>{item.areaName}</Text>
            <Text style={styles.listItemTime}>
              {moment(item.date).utcOffset(-5).format('H:mm')}
              </Text>
          </View>
        </View>
      </View>
    );
  };

  const filteredReports = seeAdmonished
    ? reportList.filter((report) => report.Deleted).filter((report) => report.Reported)
    : reportList.filter((report) => report.Deleted).filter((report) => !report.Reported);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de incidentes</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, seeAdmonished && styles.selectedButton]}
          onPress={() => setSeeAdmonished(true)}
        >
          <Text style={[styles.buttonText, seeAdmonished && styles.underlinedText]}>Amonestados</Text>
        </Pressable>
        <Pressable
          style={[styles.button, !seeAdmonished && styles.selectedButton]}
          onPress={() => setSeeAdmonished(false)}
        >
          <Text style={[styles.buttonText, !seeAdmonished && styles.underlinedText]}>Descartados</Text>
        </Pressable>
      
      </View>
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item._id}
        renderItem={renderAdmonishedItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No hay reportes</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  listItemNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },

  title: {
    color: "#252525", // Texto oscuro
    fontSize: 24, // Tamaño de fuente ligeramente mayor
    fontWeight: "bold",
  },

  listItemInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  listItemEPPs: {
    fontSize: 12,
    color: "#333",
  },
  
  listItemTime: {
    fontSize: 12,
    color: "#333",
    marginLeft: 8,
  },
  listItemArea: {
    fontSize: 14,
    fontWeight: "bold", // Agregado para hacer el texto en negrita
    color: "#333",
    marginLeft: 8,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  selectedButton: {
    backgroundColor: "#3d3680",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  underlinedText: {
    textDecorationLine: "underline",
    fontWeight: "900",
  },
  listItemText: {
    fontSize: 16,
  },
  emptyText: {
    alignSelf: "center",
    fontSize: 16,
    marginTop: 20,
  },
});