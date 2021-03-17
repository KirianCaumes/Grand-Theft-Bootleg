import React from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/general-conditions.module.scss"
// @ts-ignore
import { Section, Container } from 'react-bulma-components'
import getConfig from 'next/config'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function GeneralConditions() {
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <Head>
                <title>General conditions - {publicRuntimeConfig.appName}</title>
                <meta
                    name="description"
                    content="General conditions of Grand Theft Bootleg."
                />
                <meta name="robots" content="noindex" />
            </Head>

            <main className={styles['general-conditions']}>
                <Section>
                    <Container>
                        <h1 className="title is-1 is-title-underline">Legal notice</h1>
                        <br />
                        <h2 className="title is-3 is-title-underline">Creation and hosting of Web site</h2>
                        <br />
                        <p className="is-size-5 space-para">.............</p>
                        <br />
                        <h2 className="title is-3 is-title-underline">TERMS OF USE :</h2>
                        <br />
                        <h3 className="title is-4 is-title-underline">Ownership of Web site and Intellectual Property</h3>
                        <br />
                        <p className="is-size-5 space-para">Grand Theft Bootleg is the owner of this Web site and manages it. Grand Theft Bootleg will strive to ensure this Web site is updated using appropriate procedures.
                        Elements belonging to Grand Theft Bootleg and/or affiliates such as the Web site, trademarks, drawings, models, images, texts, photos, logos, in-house graphical styles, software, search engines and databases, although this list is not exhaustive, are the exclusive property of Grand Theft Bootleg or its affiliates.
                        These terms of use shall not be construed as expressly or impliedly granting the Visitor or any third party any license, express or implied, or any right, title or interest in respect of any items represented in the Web site.
                        Grand Theft Bootleg shall be the sole and exclusive owner of any intellectual property rights attached thereof.
                        Any representation, total or partial, of the Web site without the express permission of Grand Theft Bootleg is prohibited and would constitute an infringement sanctioned by articles L. 335-2 et seq. of the French Intellectual Property Code. The trademarks of the Web site publisher and its partners as well as the logos appearing on the Web site are registered trademarks (semi-figurative or otherwise).</p>
                        <br />
                        <h3 className="title is-4 is-title-underline">Hypertext Links and Viruses</h3>
                        <br />
                        <p className="is-size-5 space-para">The Web site may include links to other Web sites or other Internet sources. Insofar as Grand Theft Bootleg cannot control these Web sites and external sources, Grand Theft Bootleg may not be held responsible for the availability of these external Web sites and sources, and rejects any liability in respect of the content, advertising, products, services or other materials available on or from such Web sites or external sources.
                        The decision to activate the links resides solely with you.
                        It is also your responsibility to take the necessary precautions to ensure that the Web site you select does not contain viruses or any other destructive parasite.</p>
                        <br />
                        <h3 className="title is-4 is-title-underline">Absence of responsibility and guarantee</h3>
                        <br />
                        <p className="is-size-5 space-para">The accuracy, relevance and completeness of the information contained on this Web site are not guaranteed. This information cannot be construed as an offer, invitation or encouragement to buy or sell products or services described herein. The use of information and/or data contained in this Web site shall be at the sole risk of the Visitor. The information contained on this Web site is provided for information purposes only. Although Grand Theft Bootleg strives to provide reliable content on its Web site, it does not guarantee that its content is free of inaccuracies and omissions, and it may not be held responsible for errors or omissions or a lack of availability of information and services. Grand Theft Bootleg reserves the right at any time and without notice to make improvements and/or changes to the content of its Web site.
                        Grand Theft Bootleg and its affiliates may not be held responsible for direct or indirect losses that may result from access to the Web site or use of the Web site and/or information, including inaccessibility, loss of data, damage, destruction or viruses that may infect the Visitor’s computer equipment and/or the presence of viruses on its Web site.
                        Consequently, the user agrees to use this information under his exclusive responsibility.</p>
                        <br />
                        <h3 className="title is-4 is-title-underline">Applicable law – Jurisdiction</h3>
                        <br />
                        <p className="is-size-5 space-para">These terms and conditions come into force as soon as they are posted online and shall be binding on the date of the first use of the Web site by the Visitor.
                        These terms are governed by French law. Any dispute arising out of or in connection with the use of this Web site shall be subject to the exclusive jurisdiction of the French Courts.
                        It is recalled that the Grand Theft Bootleg Web site is not intended for persons covered by a jurisdiction where (by reason of that person’s nationality, place of residence or otherwise) access to this Web site is prohibited.
                        Persons subject to such restrictions must not access the Grand Theft Bootleg Web site.</p>
                        <br />
                        <h2 className="title is-3 is-title-underline">INFORMATION PROVIDED BY NET USERS – PROTECTION OF PERSONAL DATA</h2>
                        <br />
                        <h3 className="title is-4 is-title-underline">Confidentiality and Integrity</h3>
                        <br />
                        <p className="is-size-5 space-para">The confidentiality and integrity of information is not guaranteed on the Internet. Therefore, messages that you send to us by electronic means may be intercepted and/or modified, both in their content and their origin.
                        Grand Theft Bootleg disclaims any responsibility in this regard. If you do not wish to send personal information over the network, you can use postal mail to communicate it to Grand Theft Bootleg.</p>
                        <br />

                        <h3 className="title is-4 is-title-underline">Personal Data</h3>
                        <br />
                        <p className="is-size-5 space-para">At Eramet, we attach great importance on how we use your personal data. We wish to inform you, on a totally transparent basis, about our practices regarding the collection, use and disclosure of personal data that you provide to us.
                        This also applies to all types of data that may be collected by cookies and other technologies used on our website.</p>
                        <br />
                        <h3 className="title is-4 is-title-underline">Collection and use of personal data</h3>
                        <br />
                        <p className="is-size-5 space-para">We may collect personal data that you voluntarily provide to us when you:
                        <br />
                        ask us for information about our products and / or services;
                        send us a question;
                        subscribe to our services; and
                        submit your resume directly or in response to a job posting published on our website.
                        The personal data you provide to us constitutes:
                        <br />
                        contact data, such as name, e-mail address, postal address, and telephone number;
                        login credentials to connect to our website, such as username and password;
                        other data pertaining to account registration and the user profile, such as occupation, education, qualifications, and photo(s);
                        comments, and other information you provide, including search queries, questions and information that you send to customer service; and/or
                        communication interests and preferences, including the preferred language.
                        We may also collect your personal data from social networks when you allow Eramet to access your data on a social network.
                        <br />
                        This data can be used for:
                        <br />
                        communicating with you to respond to your inquiries;
                        following up on your subscriptions;
                        assessing your profile for employment purposes;
                        complying with applicable legislation or any other legal obligation.
                        his data will be kept for the established duration based on the legitimate reasons for which it was collected, as well as for other essential purposes such as respecting our legal obligations, commercial and financial record-keeping, conflict resolution, security purposes, and detecting and preventing fraud and misuse. In all cases, the retention period of your data is determined according to applicable legal provisions.</p>
                        <br />
                        <h3 className="title is-4 is-title-underline">Disclosure of personal data</h3>
                        <br />
                        <p className="is-size-5 space-para">We may disclose your personal information to third parties if it is necessary to:
                        <br />
                        comply with any law, regulation, legal procedure or other legal obligation;
                        detect, investigate and prevent security problems, fraud or technical problems;
                        protect the rights, property or safety of Eramet, our users, employees or others.
                        <br />

                        In the event of disclosure to third parties for the aforementioned reasons, Eramet undertakes to take the necessary steps to protect your personal data.
                        <br />
                        Your personal data may be disclosed to affiliates of the Eramet group in charge of processing your requests, subscriptions or applications outside your country of residence.
                        <br />
                        In the event of such transfers, Eramet has established internal privacy policies and processes to ensure a high level of protection across all Eramet affiliates, regardless of where the personal data come from and where they are processed.
                        <br />
                        We may also share the information you have provided to the suppliers we use to perform services on our behalf. Under their contract, these providers are not permitted to use or disclose such data except to the extent needed to provide these services or meet legal requirements. We may also disclose information about you when required or permitted by law.</p>
                        <br />
                        <h3 className="title is-4 is-title-underline">Security measures</h3>
                        <br />
                        <p className="is-size-5 space-para">We take appropriate physical, technical and administrative security measures to protect against unauthorized access to personal data that you voluntarily provide to us and against any unauthorized use or disclosure thereof. In the event that an unauthorized third party has access to your data, we will inform you and also notify the Commission Nationale Informatique et Libertés (CNIL) or any other national authority if these data are not stored in France.
                        <br />
                        Your rights and your choices on your data
                        <br />
                        you have a right of access, which allows you to read the personal data in our possession;
                        you have a right to rectify your data by asking us to modify these data if they are inaccurate;
                        you have a right to be forgotten, and to request the deletion of your personal data if they are not necessary for the purpose of your request;
                        you have a right to the portability of the data, i.e. you can recover all the data that you have given us, in a standard, operable format by contacting our Data Protection Officer.
                        Finally, if you consider that the processing of your data has been carried out in violation of the applicable regulations, you have the right to lodge a complaint with CNIL.</p>

                    </Container>
                </Section>
            </main>
        </>
    )
}