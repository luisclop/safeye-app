import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import { 
  StyleSheet, 
  StatusBar, 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text,
  Alert,
} from "react-native";
// import { SelectList } from 'react-native-dropdown-select-list'
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import {
  DEFAULT_BACKGROUND_IMAGE,
  LAST_IMG
} from "../constantes/images";
import { URL, COMPANY_ID } from "../constantes/string";
import CustomModal from "../components/Window.jsx";
import useReports from "../hooks/useReports";
// import useAreas  from "../hooks/useAreas";
import { Report } from "../types";
import axios from "axios";
// import CameraComponent from "../components/cameraIn";

export function HomeScreen() {
  //Camara settings
  // const [isCameraOpen, setIsCameraOpen] = useState(false);
  // const [capturedPhotoUri, setCapturedPhotoUri] = useState("");

  // const openCamera = () => {
  //   setIsCameraOpen(true);
  // };

  // const closeCamera = (photoUri: string) => {
  //   setIsCameraOpen(false);
  //   setCapturedPhotoUri(photoUri);
  // };
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  const reportList = useReports();
  // const areaList = useAreas();
  const [nombreE, setNombreE] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");

  // const [modal1, setModal1] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isButtonSend, setisButtonSend] = useState(false);
  const selectedCardRef = useRef(null); 
  const idRef = useRef(null); 

  const [cardsData, setCardsData] = useState([
    {
      id: 1,
      backgroundImage: DEFAULT_BACKGROUND_IMAGE,
      zona: "",
      epp: "",
      tiempo: "",
      deleted: true,
      _id: ""
    }
  ]);
  
  // const [selected, setSelected] = useState("");

  // const data = areaList.map((area: Area) => ({key: area._id, value: area.name}));

  // const addNewCard = async () =>{
  //   setModal1(true);
  // }
  
  // const closeModal = () =>{
  //   setModal1(false);
  // }

  const handleRedButtonPress = async (id: number) => {
    const updatedCardsData = [...cardsData]; // Hacer una copia de las cartas existentes
    const selectedIndex = updatedCardsData.findIndex((card) => card.id === id);
  
    if (selectedIndex !== -1) {
      Alert.alert(
        "¿Estás seguro de descartar este incidente?",
        "Una vez descartado, no podrás recuperar la información.",
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "Sí, descartar",
            onPress: async () => {
              try {
                await axios.put(
                  `${URL}/company/${COMPANY_ID}/incidents/${updatedCardsData[selectedIndex]._id}`,
                  { Reported: false, Deleted: true }
                );
                updatedCardsData.splice(selectedIndex, 1);
                setCardsData(updatedCardsData);
                setMessage('La carta fue eliminada exitosamente.');
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
              } catch (error) {
                console.error(error);
              }
            }
          }
        ],
        { cancelable: false }
      );
    }
  };
  
  const handleGreenButtonPress = async (id: number) => {
    const updatedCardsData = [...cardsData];
    const selectedIndex = updatedCardsData.findIndex((card) => card.id === id);
    if (selectedIndex !== -1) {    
      setSelectedId(updatedCardsData[selectedIndex]._id);
      // Mostrar el modal
      setModalVisible(true);
      updatedCardsData.splice(selectedIndex, 1);
      setCardsData(updatedCardsData);
  }};
  
  useEffect(() => {
    const updatedCardsData = reportList.map((report: Report, index: number) => ({
      id: index + 1,
      backgroundImage: report.imageUrls[0],
      zona: report.areaName,
      epp: report.EPPs.join("   "),
      tiempo: moment(report.date).utcOffset(-5).format('D/M/YYYY H:mm'),
      deleted: report.Deleted,
      _id: report._id
    }));
  
    setCardsData(updatedCardsData);
  }, [reportList, showMessage]);

  // const handleEnvio = async (area: string,image: string) => {
  //   try {
  //     const base64Image = await convertToBase64(image);
  //     const response = await axios.post(`${URL}/company/${COMPANY_ID}/incidents`, {
  //       "ID_area": area,
  //       "ID_Cam":"6505633501f1e713f9f60f70",
  //       "imageUrls": [base64Image],
  //     });
  //     console.log("Respuesta del envio:", response);
  //     setModal1(false);
  //   } catch (error) {
  //     console.error("Error al enviar:", error);
  //   }
  // }

  // const convertToBase64 = async (imageUrl: string): Promise<string> => {
  //   // Realiza una petición HTTP GET para obtener la imagen como un array buffer
  //   const response = await axios.get(imageUrl, {
  //       responseType: 'arraybuffer',
  //   });
    
  //   // Convierte el array buffer a base64
  //   const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    
  //   return `data:${response.headers['content-type']};base64,${base64Image}`;
  // }

  useEffect(() => {
    if (isButtonSend) {
      if (idRef.current !== null) {
        const updatedCardsData = cardsData.filter((card) => card.id !== idRef.current);
        setCardsData(updatedCardsData);
      }
  
      if (selectedCardRef.current) {
        console.log("Tarjeta seleccionada:", selectedCardRef.current);
        console.log("ID seleccionado:", idRef.current);
      }
  
      setModalVisible(false);
      setisButtonSend(false);
    }
  }, [isButtonSend, cardsData]);

  const activeCardsData = cardsData.filter((cardData) => !cardData.deleted);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* <Pressable style={styles.add} onPress={()=>addNewCard()}>
        <Text style={styles.empresa}>Añadir incidente +</Text>
      </Pressable> */}
      
      <ScrollView horizontal={true} style={styles.scrollView}>
        {cardsData
          .filter((cardData) => !cardData.deleted)
          .map((cardsData, index) => (
          <Card
            key={index}
            backgroundImage={cardsData.backgroundImage}
            onGreenButtonPress={() => handleGreenButtonPress(cardsData.id)}
            onRedButtonPress={() => handleRedButtonPress(cardsData.id)}
            onImagePress={() => {}}
            zona={cardsData.zona}
            epp={cardsData.epp}
            tiempo={cardsData.tiempo}
          />
        ))}
        {cardsData.length <= 0 && (
          <Card
            backgroundImage={LAST_IMG}
            onGreenButtonPress={() => {}}
            onRedButtonPress={() => {}}
            onImagePress={() => {}}
            zona={""}
            epp={""}
            tiempo={""}
          />
        )}
        {activeCardsData.length > 0 && (
          <View style={styles.notificacion}>
            <Ionicons
              name={"ellipse-sharp"}
              size={50}
              color={activeCardsData.length > 0 ? "#F44343" : "#cbcdd1"}
              style={styles.noti}
            />
            <Text style={activeCardsData.length < 10 ? styles.number1 : styles.number}>
              {activeCardsData.length}
            </Text>
          </View>
        )}
      </ScrollView>
      {isModalVisible && (
        <CustomModal
          isModalVisible={isModalVisible}
          setisButtonSend={setisButtonSend}
          onClose={() => {
            setModalVisible(false);
          }}
          incidentId={selectedId}
        />
      )}

      {showMessage && (
        <Text style={{
          position: 'absolute',
          zIndex: 1,
          backgroundColor: 'rgba(128, 128, 128, 0.5)', // Fondo gris claro con transparencia
          padding: 10, // Añade relleno alrededor del texto
          borderRadius: 10, // Agrega bordes redondeados alrededor del mensaje
          textAlign: 'center', // Centra el texto horizontalmente
          width: '80%', // Define el ancho del mensaje
          top: '50%', // Posiciona el mensaje en la mitad de la pantalla verticalmente
          left: '10%', // Centra el mensaje horizontalmente
          transform: [{ translateY: -50 }], // Ajusta el mensaje verticalmente hacia arriba
          color: 'white',
          fontSize: 16,
          fontWeight:"700",
        }}>
          {message}
        </Text>
      )}     
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modal1}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={styles.title}>Añade una desviación</Text>
          <Text style={styles.subtitle}>Zona donde ocurrio:</Text>
          <SelectList 
            setSelected={(key: React.SetStateAction<string>) => setSelected(key)} 
            data={data} 
            save="key"
          />
          <Text style={styles.subtitle}>Fotografía del incidente:</Text>
          <ImageBackground source={{uri:capturedPhotoUri?capturedPhotoUri:LAST_IMG}} style={{width: 180, height: 180, alignSelf: 'center'}} />
          <TouchableOpacity 
          onPress={openCamera}
          style={[styles.button, styles.buttonClose]}>
            <Text>Abrir cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEnvio(selected,capturedPhotoUri)}
            style={[styles.button, styles.buttonClose]}>
            <Text>Subir incidente</Text>
          </TouchableOpacity>
          <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => closeModal()}>
            <Text>Hide it</Text>
          </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={isCameraOpen}>
        <View style={styles.cameraModal}>
          <CameraComponent closeModal={closeCamera}/>
        </View>
      </Modal> */}

    </SafeAreaView>
  );
}

//Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 20,
  },
  notificacion: {
    position: "absolute",
    top: 80,
    left: 20,
  },
  noti: {
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 1,
  },
  number: {
    position: "absolute",
    color: "#F1FAEE",
    fontSize: 28,
    right: 10,
    top: 3
  },
  number1: {
    position: "absolute",
    color: "#F1FAEE",
    fontSize: 28,
    right: 18,
    top: 4
  },
  empresa:{
    position: "absolute",
    color: "#F1FAEE",
    fontSize: 16,
    fontWeight: "bold",
    top: 7,
    left:18
  },
  add:{
    position:"absolute",
    top: 90,
    right: -10,
    zIndex:1,
    borderWidth: 0.5,
    borderColor: "#252525",
    backgroundColor:"#3d3680",
    width: 180,
    height: 40,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 40,
    bottom:20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 8,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal:3,
    marginVertical:1,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  title:{
    fontSize: 24,
    fontWeight:"700",
    textAlign: "center",
  },
  subtitle:{
    fontSize: 14,
    fontWeight:"500",
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxForm:{
    flexDirection:"row"
  },
  cameraModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});