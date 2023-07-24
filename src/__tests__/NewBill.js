/**
 * @jest-environment jsdom
 */

import NewBillUI from '../views/NewBillUI';
import NewBill from '../containers/NewBill';
import { ROUTES_PATH, ROUTES } from '../constants/routes';
import store from '../__mocks__/store';
import { localStorageMock } from '../__mocks__/localStorage';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import router from '../app/Router';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test("Then I'm only able to send documents in .jpg, .jpeg or .png format", async () => {
      // Bill demande comme paramètre document, onNavigate, store, localStorage
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      console.log('onNavigate', onNavigate);
      console.log('document.body.innerHTML', document.body.innerHTML);

      // Mock du local storage => Substitution du localStorage global
      // Cela remplace le localStorage global avec votre objet de substitution 
      // localStorageMock. Désormais, lorsque votre code accède à localStorage, il 
      // utilisera l'objet de substitution au lieu du localStorage réel du navigateur.
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });


      // Je me log au localStorage
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );

      // création du point d'ancrage dans le DOM
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      console.log('document.body', document.body);

      // insertion dans roots tout ce qui est nécessaire dans le DOM
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      //création d'une navigation vers NewBill
      document.body.innerHTML = NewBillUI();

      // Création de newBill
      // Bill demande comme paramètre document, onNavigate, store, localStorage
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage,
      });

      // Forcer un upload de fichier -> on récupère le nom du fichier
      const fileInput = screen.getByTestId('file');
      console.log(fileInput);

      //Regarder comment on instancie une api file js => fireEvent[eventName]
      const test = fireEvent.change(fileInput, {
        target: {
          files: [new File(['test'], 'test.jpg', { type: 'image/jpg' })],
        },
      });
      console.log("test", test)

      // Vérification si dans mon input j'ai un fake file
      expect(fileInput.files[0].name).toBe('test.jpg');

      // J'attends que tout mes traitements (handle submit) ont été fait
      await waitFor(() => {
        expect(newBill.fileUrl).toEqual(
          'https://localhost:3456/images/test.jpg'
        );
      });
    });
  });
});
