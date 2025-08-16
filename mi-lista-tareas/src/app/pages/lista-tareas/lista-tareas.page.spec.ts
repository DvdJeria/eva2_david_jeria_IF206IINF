import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaTareasPage } from './lista-tareas.page';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';

// Crea un "mock" para el servicio Geolocation
const geolocationMock = {
  getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.returnValue(
    Promise.resolve({
      coords: {
        latitude: 10,
        longitude: 20,
        accuracy: 100
      },
      timestamp: Date.now()
    })
  )
};

// Crea un "mock" para el servicio Camera
const cameraMock = {
  getPhoto: jasmine.createSpy('getPhoto').and.returnValue(
    Promise.resolve({
      dataUrl: 'data:image/jpeg;base64,mocked-image-data',
    })
  )
};

describe('ListaTareasPage', () => {
  let component: ListaTareasPage;
  let fixture: ComponentFixture<ListaTareasPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ListaTareasPage],
      providers: [
        { provide: Geolocation, useValue: geolocationMock }, // Provee el Geolocation simulado
        { provide: Camera, useValue: cameraMock } // Provee la Camera simulada
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaTareasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Código de la prueba, en el archivo .spec.ts
  it('debería obtener la ubicación actual y actualizar ubicacionActual', async () => {
    // Inicializamos la variable con la misma estructura de la interfaz
    component.ubicacionActual = {
      coords: {
        latitude: 10,
        longitude: 20,
        accuracy: 100,
      },
      timestamp: Date.now(),
    };

    // El resto del código de tu prueba...
    await component.obtenerUbicacion();

    // Ahora, podemos acceder a las propiedades de forma segura
    expect(component.ubicacionActual.coords.latitude).toBe(10);
    expect(component.ubicacionActual.coords.longitude).toBe(20);
  });

  // En el bloque 'it' de tu prueba de la cámara
  it('debería capturar una foto y agregarla a la lista', async () => {
    // 1. Inicia la lista de imágenes vacía para tener un estado predecible
    component.imagenesCapturadas = [];

    // 2. Llama a la función asíncrona y espera a que termine
    await component.tomarFoto();

    // 3. Verifica que la función del mock fue llamada
    expect(cameraMock.getPhoto).toHaveBeenCalled();

    // 4. Comprueba que el arreglo se actualizó y contiene la imagen simulada
    expect(component.imagenesCapturadas.length).toBe(1);
    expect(component.imagenesCapturadas[0]).toContain('mocked-image-data');
  });
});