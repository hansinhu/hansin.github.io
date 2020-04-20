import React from 'react'
// import PropTypes from 'prop-types'

import styles from './PageFooter.less'

const PageFooter = () => {
  const footerLinkList = [
    {
      title: 'Get to Know Us',
      children: [
        {
          title: 'Factory Price',
          link: '/document/factory-price',
          target: '_blanck',
        },
        {
          title: 'About Us',
          link: '/document/about-us',
          target: '_blanck',
        },
        {
          title: 'Terms & Conditions',
          link: '/document/terms-conditions',
          target: '_blanck',
        },
        {
          title: 'Privacy Policy',
          link: '//m.clubfactory.com/act/PRIVACY_POLICY_CLUB_FACTORY_2020.html',
          target: '_blanck',
        },
        {
          title: 'Contact Us',
          link: '/document/contact-us',
          target: '_blanck',
        },
        {
          title: 'Abuse and Takedown Policy',
          link: '//m.clubfactory.com/act/REPORT_ABUSE_AND_TAKE_DOWN_POLICY_2020.html',
          target: '_blanck',
        },
      ],
    },
    {
      title: 'Let Us Help You',
      children: [
        {
          title: 'Shipping',
          link: '/document/shipping',
          target: '_blanck',
        },
        {
          title: 'Return Policy',
          link: '/document/about-returns',
          target: '_blanck',
        },
        {
          title: 'Payment Protection',
          link: '/document/payment-protection',
          target: '_blanck',
        },
        {
          title: 'FAQ',
          link: '/document/faq',
          target: '_blanck',
        },
      ],
    },
    {
      title: 'Collaborate with Us',
      children: [
        {
          title: 'Club Factory Ambassador',
          link: '/document/clubfactory-ambassador',
          target: '_blanck',
        },
        {
          title: 'Short Videos',
          link: '/document/short-videos',
          target: '_blanck',
        },
        {
          title: 'Business Partnerships',
          link: '/document/business-partnerships',
          target: '_blanck',
        },
      ],
    },
  ]

  const currentYear = new Date().getFullYear()

  return <footer className={styles.footer_wrap}>
    <div className={styles.footer_content}>
      <div className={styles.all_list}>
        {
          footerLinkList.map((types, i) => {
            return <ul className={styles.link_list} key={i}>
              <li className={styles.link_title}>{types.title}</li>
              {
                types.children.map((child, j) => {
                  return <li className={styles.link_name} key={j}>
                    <a
                      href={child.link}
                      target={child.target}
                      rel='noopener noreferrer'
                    >
                      {child.title}
                    </a>
                  </li>
                })
              }
            </ul>
          })
        }
      </div>
      <div className={styles.right}>&#169; {currentYear} Club Factory</div>
    </div>
  </footer>
}

export default PageFooter
