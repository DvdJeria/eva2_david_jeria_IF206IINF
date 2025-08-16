import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonButton, IonIcon, IonInput, IonCardContent, IonCardTitle,
  IonCardHeader, IonCard, IonSegment, IonSegmentButton, IonListHeader, IonSpinner,
  IonCardSubtitle, IonItemDivider
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { trashOutline, cameraOutline, locationOutline, addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';


//Definir interface Tarea
interface Tarea {
  id: number,
  titulo: string,
  descripcion: string,
  completado: boolean;
}

interface Coctel {
  strDrink: string;
  strDrinkThumb: string;
  idDrink: string;
}

interface RespuestaCocteles {
  drinks: Coctel[];
}

interface UbicacionGPS {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}


@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.page.html',
  styleUrls: ['./lista-tareas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
    IonLabel, IonButton, IonIcon, IonInput, FormsModule, CommonModule, DatePipe,
    HttpClientModule, IonCard, IonCardContent, IonCardTitle, IonCardHeader, 
    IonSegment, IonSegmentButton, IonListHeader, IonSpinner, IonCardSubtitle, 
    IonItemDivider]
})

export class ListaTareasPage {

  //Objeto para la nueva tarea
  nuevaTarea: Tarea = {
    id: 0,
    titulo: '',
    descripcion: '',
    completado: false
  }

  //Guartdar la imagen de la tarea
  imagenesCapturadas: string[]=[];

  segmentoSeleccionado: string = 'tareas';

  //Variable para cocteles
  cocteles: Coctel[] = [];
  cargandoCocteles: boolean = false;

  //Variables del GPS
  ubicacionActual: UbicacionGPS | undefined;
  obteniendoUbicacion: boolean = false;

  //Definir el arreglo de tareas
  tareas: Tarea[] = [
    {
      id: 1,
      titulo: 'Titulo número 1',
      descripcion: 'Esta tarea esta predefinida',
      completado: false
    },
    {
      id: 2,
      titulo: 'Titulo número 2',
      descripcion: 'Esta tarea esta predefinida',
      completado: false
    },
    {
      id: 3,
      titulo: 'Titulo número 3',
      descripcion: 'Esta tarea esta predefinida',
      completado: false
    },
  ];

  constructor(private Http: HttpClient) {
    addIcons({ trashOutline, cameraOutline, locationOutline, addOutline });
  }


  ngOnInit() {
    this.cargarCocteles();
  }


  //Metodo para eliminar una tarea
  eliminarTarea(id: number) {
    this.tareas = this.tareas.filter(tarea => tarea.id !== id);
  }

  agregarTarea() {
    if (this.nuevaTarea.titulo.trim() !== '') {
      //Generar nuevo ID basado en el maximo ID actual +1
      const nuevoId = Math.max(...this.tareas.map(t => t.id), 0) + 1;

      //Crear una copia de la nueva tarea con el ID generado
      const tareaAgregar: Tarea = {
        ...this.nuevaTarea,
        id: nuevoId
      }

      //Agregar la tarea al arreglo
      this.tareas.push(tareaAgregar);

      //Limpiar el formulario
      this.nuevaTarea = {
        id: 0,
        titulo: '',
        descripcion: '',
        completado: false
      }
    }
  }

// En el método tomarFoto()
async tomarFoto() {
  try {
    const foto = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    if (foto && foto.dataUrl) {
      // Añade la nueva imagen al arreglo
      this.imagenesCapturadas.push(foto.dataUrl);
      return foto;
    }

    return null;

  } catch (error) {
    console.error('Error al tomar la foto:', error);
    return null;
  }
}

  cargarCocteles() {
    this.cargandoCocteles = true;
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic';
    this.Http.get<RespuestaCocteles>(url).subscribe({
      next: (respuesta) => {
        this.cocteles = respuesta.drinks.slice(0, 5);
        this.cargandoCocteles = false;
      },
      error: (error) => {
        console.error('Error al cargar los cocteles:', error);
        this.cargandoCocteles = false;
      }
    });
  }

  async obtenerUbicacion() {
    this.obteniendoUbicacion = true;
    try {
      const permiso = await Geolocation.requestPermissions();

      if (permiso.location === 'granted') {
        const posicion = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
        this.ubicacionActual = {
          coords: {
          latitude: posicion.coords.latitude,
          longitude: posicion.coords.longitude,
          accuracy: posicion.coords.accuracy
        },
        timestamp: posicion.timestamp
      };

        console.log('Ubicación obtenida:', this.ubicacionActual);
      } else {
        console.warn('Permiso de ubicación denegado');
        alert('Permiso de ubicación denegado. Por favor, habilita el permiso en la configuración de la aplicación.');
      }


    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    } finally {
      this.obteniendoUbicacion = false;
    }
  }
}
