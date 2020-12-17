/// <reference types="cypress" />
import { pages } from '../support/pages'
import 'cypress-lighthouse';
describe('ADA', () => {
  pages.forEach((page) => {
    describe(`Page: ${page}`, () => {
      beforeEach(() => {
        cy.visit(page)
        cy.lighthouse(`http://localhost:1234/${page}`).as('results')
      })      
      it('Meets accessibility benchmarks', function () {
        // Assert that the accessibility metric is greater than .80
        cy.wrap(this.results.accessibility).should('be.gt', .80);
      })
      it(`Should set the lang attribute`, () => {
        const $sel = cy.get('table[lang]')
        $sel.should('exist')
      })
      it(`Should set the viewport meta tag`, () => {
        const $sel = cy.get('meta[name="viewport"]')
        $sel.should('exist')
      })
      
      it(`<p> line-height above 32px`, () => {
        if (Cypress.$('p').length > 0) {
          cy.get('p').then(($element) => {
            const lineHeight = $element.css('line-height');
            expect(parseInt(lineHeight.replace('px', ''))).to.be.greaterThan(31)
            $element.parent().css('border', '2px dashed magenta')
          })
        }
      })      
      it(`Should follow a heading structure`, () => {
        const h1Amount = Cypress.$('h1').length;
        const h2Amount = Cypress.$('h2').length;
        const h3Amount = Cypress.$('h3').length;
        const h4Amount = Cypress.$('h4').length;
        const h5Amount = Cypress.$('h5').length;
        const h6Amount = Cypress.$('h6').length;
        if (h6Amount > 0) {
          expect(h5Amount).to.be.greaterThan(0)
          expect(h4Amount).to.be.greaterThan(0)
          expect(h3Amount).to.be.greaterThan(0)
          expect(h2Amount).to.be.greaterThan(0)
          expect(h1Amount).to.be.greaterThan(0)
        }
        if (h5Amount > 0) {
          expect(h4Amount).to.be.greaterThan(0)
          expect(h3Amount).to.be.greaterThan(0)
          expect(h2Amount).to.be.greaterThan(0)
          expect(h1Amount).to.be.greaterThan(0)
        }
        if (h4Amount > 0) {
          expect(h3Amount).to.be.greaterThan(0)
          expect(h2Amount).to.be.greaterThan(0)
          expect(h1Amount).to.be.greaterThan(0)
        }
        if (h3Amount > 0) {
          expect(h2Amount).to.be.greaterThan(0)
          expect(h1Amount).to.be.greaterThan(0)
        }
        if (h2Amount > 0) {
          expect(h1Amount).to.be.greaterThan(0)
        }
      })
      it(`Should use role="presentation" for layout tables`, () => {
        const $sel = cy.get('table').not('[role="presentation"]')
        if (Cypress.$('table :not([role="presentation"])').length > 0) {
          $sel.then(($element) => {
            $element.css('border', '2px dashed magenta')
          })
        }
        $sel.should('not.exist')
      })
      it(`Should use <ul> or <ol>.`, () => {
        const $sel = cy.get('ul, ol')
        $sel.should('exist')
      })
      it(`Should not use <br>.`, () => {
        const $sel = cy.get('br')
        if (Cypress.$('br').length > 0) {
          $sel.then(($element) => {
            $element.parent().css('border', '2px dashed magenta')
          })
        }
        $sel.should('not.exist')
      })
      it(`Use the right tags for font weight bold`, () => {
        if (Cypress.$('body').length > 0) {
          cy.get('body').then(($element) => {
            const html = $element.html()
            // console.log(html);
            const regex = /font-weight: bold/gi
            let match;
            let tag = '';
            while ((match = regex.exec(html)) != null) {     
              let index = match.index
              // Find the start of tag
              while(html[index] != '<') {
                index -= 1
              }
              // Record tag
              while(html[index] != ' ') {
                index += 1
                tag += html[index]
              }
              const allowedTags = ['strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
              expect(allowedTags).to.contain(tag.trim())
              tag = ''
            }
          })
        }
      })     
    })
  })
})
