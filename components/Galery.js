import React, { useState } from 'react';
import { View, Text, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = 'URL_DE_TU_API'; // URL global

const Galery = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImages(prevImages => [...prevImages, result]);
    }
  };

  const uploadImages = async () => {
    const formData = new FormData();

    selectedImages.forEach((image, index) => {
      formData.append(`image_${index}`, {
        uri: image.uri,
        name: `image_${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Imágenes subidas con éxito');
      } else {
        console.error('Error al subir imágenes');
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error);
    }
  };

  const fetchImagesFromAPI = async () => {
    try {
      const response = await axios.get(`${API_URL}/images`);
      setUploadedImages(response.data); // Suponiendo que la respuesta de la API sea un array de URLs de imágenes
    } catch (error) {
      console.error('Error al obtener imágenes desde la API:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Seleccionar imágenes" onPress={pickImage} />
      <Button title="Subir imágenes" onPress={uploadImages} disabled={selectedImages.length === 0} />
      
      <ScrollView style={{ marginTop: 20, maxHeight: 200 }}>
        {selectedImages.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={{ width: 200, height: 200, marginBottom: 10 }} />
        ))}
      </ScrollView>

      <Button title="Obtener imágenes desde la API" onPress={fetchImagesFromAPI} />

      <ScrollView style={{ marginTop: 20, maxHeight: 200 }}>
        {uploadedImages.map((imageUrl, index) => (
          <TouchableOpacity key={index} onPress={() => console.log('Imagen seleccionada:', imageUrl)}>
            <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200, marginBottom: 10 }} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Galery;
