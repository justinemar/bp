/* eslint-disable no-undef */
import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Register from '../Form/Register';


Enzyme.configure({ adapter: new Adapter() });

describe('<Register />', () => {
    const wrapper = mount(<Register />);

    it('should have a `<form>` element', () => {
        expect(wrapper.find('form').length).toBe(1);
    });

    it('should show danger on change for invalid email', () => {
      const emailInput = wrapper.find('input[type="email"]');
      emailInput.instance().value = 'Changed';
      emailInput.simulate('change');
      expect(wrapper.find('input[type="email"]').prop('value')).toBe('Changed');
      expect(wrapper.find('.error').text()).toEqual('Invalid email address.');
    });

    it('should show danger on change for invalid username', () => {
      const userInput = wrapper.find('input[type="text"]');
      userInput.instance().value = '<invalidUserName>';
      userInput.simulate('change');
      expect(wrapper.find('input[type="text"]').prop('value')).toBe('<invalidUserName>');
      expect(wrapper.find('.error').at(1).text()).toEqual('Usernames may only contain letters, numbers, and _.');
    });

    it('should show danger on form submit with empty fields', () => {
      wrapper.find('form').simulate('submit', { preventDefault() {} });
      expect(wrapper.find('.error').at(0).text()).toEqual('Missing Informations!');
    });
});
