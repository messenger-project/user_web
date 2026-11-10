import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

import type { CvData } from "@/types/cv";

interface ModernTemplateProps {
    cv: CvData;
}

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        fontFamily: "Helvetica",
        fontSize: 9,
        color: "#141414",
        backgroundColor: "#FFFFFF",
    },
    sidebar: {
        width: "32%",
        backgroundColor: "#02394F",
        paddingTop: 35,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    content: {
        width: "68%",
        paddingTop: 35,
        paddingHorizontal: 28,
        paddingBottom: 30,
    },
    name: {
        fontSize: 24,
        fontFamily: "Helvetica-Bold",
        color: "#02394F",
        marginBottom: 6,
    },
    title: {
        fontSize: 11,
        color: "#008EED",
        marginBottom: 22,
    },
    section: {
        marginBottom: 19,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#02394F",
        marginBottom: 9,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#E8EDEF",
    },
    sidebarTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#FFFFFF",
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#53717F",
    },
    sidebarSection: {
        marginBottom: 24,
    },
    sidebarText: {
        fontSize: 8.5,
        color: "#FFFFFF",
        lineHeight: 1.5,
        marginBottom: 6,
    },
    paragraph: {
        fontSize: 9,
        lineHeight: 1.5,
        color: "#54595F",
    },
    job: {
        marginBottom: 15,
    },
    jobTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#141414",
        marginBottom: 4,
    },
    meta: {
        fontSize: 8,
        color: "#54595F",
        marginBottom: 7,
    },
    bullet: {
        fontSize: 8.5,
        lineHeight: 1.45,
        color: "#54595F",
        marginBottom: 4,
        paddingLeft: 9,
    },
});

export default function ModernTemplate({
    cv,
}: ModernTemplateProps) {
    const contact = [
        cv.personal.email,
        cv.personal.phone,
        cv.personal.location,
        cv.personal.linkedin,
        cv.personal.website,
    ].filter(Boolean);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.sidebar}>
                    {contact.length > 0 && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarTitle}>
                                CONTACT
                            </Text>

                            {contact.map((item, index) => (
                                <Text
                                    key={index}
                                    style={styles.sidebarText}
                                >
                                    {item}
                                </Text>
                            ))}
                        </View>
                    )}

                    {cv.skills.length > 0 && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarTitle}>
                                SKILLS
                            </Text>

                            {cv.skills.map((skill, index) => (
                                <Text
                                    key={index}
                                    style={styles.sidebarText}
                                >
                                    {skill}
                                </Text>
                            ))}
                        </View>
                    )}

                    {cv.languages.length > 0 && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarTitle}>
                                LANGUAGES
                            </Text>

                            {cv.languages.map((language, index) => (
                                <Text
                                    key={index}
                                    style={styles.sidebarText}
                                >
                                    {language.name}
                                    {language.level
                                        ? ` — ${language.level}`
                                        : ""}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>
                        {cv.personal.fullName}
                    </Text>

                    {cv.personal.title && (
                        <Text style={styles.title}>
                            {cv.personal.title}
                        </Text>
                    )}

                    {cv.summary && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                PROFILE
                            </Text>
                            <Text style={styles.paragraph}>
                                {cv.summary}
                            </Text>
                        </View>
                    )}

                    {cv.experience.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                EXPERIENCE
                            </Text>

                            {cv.experience.map((job, index) => (
                                <View
                                    key={index}
                                    style={styles.job}
                                    wrap={false}
                                >
                                    <Text style={styles.jobTitle}>
                                        {job.position}
                                        {job.company
                                            ? ` — ${job.company}`
                                            : ""}
                                    </Text>

                                    <Text style={styles.meta}>
                                        {[
                                            job.startDate,
                                            job.endDate,
                                            job.location,
                                        ]
                                            .filter(Boolean)
                                            .join(" | ")}
                                    </Text>

                                    {job.highlights.map(
                                        (highlight, i) => (
                                            <Text
                                                key={i}
                                                style={styles.bullet}
                                            >
                                                {"• "}{highlight}
                                            </Text>
                                        )
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {cv.education.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                EDUCATION
                            </Text>

                            {cv.education.map((education, index) => (
                                <View
                                    key={index}
                                    style={styles.job}
                                    wrap={false}
                                >
                                    <Text style={styles.jobTitle}>
                                        {education.degree ||
                                            education.field}
                                    </Text>

                                    <Text style={styles.meta}>
                                        {education.institution}
                                    </Text>

                                    <Text style={styles.meta}>
                                        {[
                                            education.startDate,
                                            education.endDate,
                                        ]
                                            .filter(Boolean)
                                            .join(" - ")}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
}