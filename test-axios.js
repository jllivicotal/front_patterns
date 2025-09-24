// Prueba simple para verificar que axios funciona con nuestro API
import axios from 'axios';

async function testAxios() {
  console.log('🧪 Probando integración con axios...\n');
  
  try {
    // Test 1: GET /api/vehiculos
    console.log('1. Probando GET /api/vehiculos...');
    const vehiculosResponse = await axios.get('http://localhost:3000/api/vehiculos');
    console.log('✅ Vehiculos obtenidos:', vehiculosResponse.data.length, 'registros');
    
    // Test 2: GET /api/activos  
    console.log('\n2. Probando GET /api/activos...');
    const activosResponse = await axios.get('http://localhost:3000/api/activos');
    console.log('✅ Activos obtenidos:', activosResponse.data.length, 'registros');
    
    // Test 3: Headers y timeout
    console.log('\n3. Probando configuración de axios...');
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    };
    
    const testResponse = await axios.get('http://localhost:3000/api/vehiculos', config);
    console.log('✅ Headers y timeout configurados correctamente');
    console.log('📊 Status:', testResponse.status);
    console.log('📊 Content-Type:', testResponse.headers['content-type']);
    
    console.log('\n🎉 ¡Todos los tests de axios pasaron exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📊 Data:', error.response.data);
    }
  }
}

// Ejecutar los tests
testAxios();