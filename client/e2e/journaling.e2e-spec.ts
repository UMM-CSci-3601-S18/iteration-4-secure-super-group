import {JournalingPage} from './journaling.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

describe('Journaling Page', () => {
    let page: JournalingPage;

    beforeEach(() => {
        page = new JournalingPage();
    });

    it('Should be titled Journals', () => {
        JournalingPage.navigateTo();
        expect(JournalingPage.getPageTitle()).toBe('Journals');
    });

    it('Should be able to add a journal entry', ()=> {
        JournalingPage.navigateTo();
        var buttonExisted = page.addNewJournal('I love CSci', 'I do, in fact, really love CSci.');
        expect(buttonExisted).toBe(true);
    });

    // Does not work

    it('Should be able to add and view a journal entry', () => {
        JournalingPage.navigateTo();
        page.addNewJournal('I am slowly becoming sentient', 'So is this how humans feel?');
        expect(page.getJournalText()).toContain('Title: I am slowly becoming sentient');
    });

    // Does not work

    it('Should be able to edit a journal entry', ()=> {
        JournalingPage.navigateTo();
        var buttonExisted = page.editJournal('Wow', 'Big wow');
        expect(buttonExisted).toBe(true);
    });

    // Does not work

    it('Should be able to edit and view a journal entry', () => {
        JournalingPage.navigateTo();
        page.editJournal('I am slowly becoming wow', 'WOW?');
        expect(page.getJournalText()).toContain('Title: I am slowly becoming wow');
    });
});
