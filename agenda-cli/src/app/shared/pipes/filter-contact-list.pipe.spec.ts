import { CONTACTS } from '../contacts.mock';
import { FilterContactListPipe } from './filter-contact-list.pipe'

describe("FilterContactListPipe", () => {
  let filterContactList: FilterContactListPipe;

  beforeAll(() => {
    filterContactList = new FilterContactListPipe();
  });

  it ("should return an empty array when contacts param is empty", () => {
    let contacts = filterContactList.transform(null, '');
    expect(contacts).toEqual([]);
  });

  it ("should show all contacts when search text is empty", () => {
    let contacts = filterContactList.transform(CONTACTS, '');
    expect(contacts).toBe(CONTACTS);
  });

  it ("should show nothing when there are no contacts to show", () => {
    let contacts = filterContactList.transform([], 'show something?');
    expect(contacts).toEqual([]);
  });

  it ("should filter by first name", () => {
    let firstName = 'Juan';
    let contacts = filterContactList.transform(CONTACTS, firstName);

    expect(contacts.length).toBe(1);
    expect(contacts[0].firstName).toBe(firstName);
  });

  it ("should filter by last name", () => {
    let lastName = 'Martinez';
    let contacts = filterContactList.transform(CONTACTS, lastName);

    expect(contacts.length).toBe(1);
    expect(contacts[0].lastName).toBe(lastName);
  });

  it ("should filter by phone number", () => {
    let phone = '+39 02 1234567';
    let contacts = filterContactList.transform(CONTACTS, phone);

    expect(contacts.length).toBe(1);
    expect(contacts[0].phone).toBe(phone);
  });

  it ("should return nothing when there are no matches", () => {
    let lastName = 'Petroons';
    let contacts = filterContactList.transform(CONTACTS, lastName);

    expect(contacts.length).toBe(0);
  });
});
