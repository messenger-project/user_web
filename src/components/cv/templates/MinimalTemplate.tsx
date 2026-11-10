import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

import type { CvData } from "@/types/cv";

interface MinimalTemplateProps {
    cv: CvData;
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingHorizontal: 48,
        fontFamily: "Helvetica",
        fontSize: 9,
        color: "#141414",
        backgroundColor: "#FFFFFF",
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#141414",
    },
    name: {
        fontFamily: "Helvetica-Bold",
        fontSize: 25,
        marginBottom: 7,
        textAlign: "center",
    },
    title: {
        fontSize: 11,
        color: "#54595F",
        marginBottom: 10,
        textAlign: "center",
    },
    contact: {
        fontSize: 8,
        color: "#54595F",
        textAlign: "center",
        lineHeight: 1.5,
    },
    section: {
        marginBottom: 19,
    },
    sectionTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 9,
        letterSpacing: 1.5,
        marginBottom: 11,
    },
    paragraph: {
        fontSize: 9,
        color: "#54595F",
        lineHeight: 1.6,
    },
    entry: {
        marginBottom: 13,
    },
    entryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 5,
    },
    entryTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 9.5,
        flex: 1,
        paddingRight: 12,
    },
    date: {
        fontSize: 8,
        color: "#54595F",
        textAlign: "right",
    },
    subtitle: {
        fontSize: 8.5,
        color: "#54595F",
        marginBottom: 7,
    },
    bullet: {
        fontSize: 8.5,
        color: "#54595F",
        lineHeight: 1.5,
        marginBottom: 4,
        paddingLeft: 9,
    },
    skills: {
        fontSize: 9,
        color: "#54595F",
        lineHeight: 1.7,
    },
});

export default function MinimalTemplate({
    cv,
}: MinimalTemplateProps) {
    const contact = [
        cv.personal.location,
        cv.personal.email,
        cv.personal.phone,
        cv.personal.linkedin,
        cv.personal.website,
    ]
        .filter(Boolean)
        .join("  |  ");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>
                        {cv.personal.fullName}
                    </Text>

                    {cv.personal.title && (
                        <Text style={styles.title}>
                            {cv.personal.title}
                        </Text>
                    )}

                    {contact && (
                        <Text style={styles.contact}>
                            {contact}
                        </Text>
                    )}
                </View>

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
                                style={styles.entry}
                                wrap={false}
                            >
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>
                                        {job.position}
                                    </Text>

                                    <Text style={styles.date}>
                                        {[
                                            job.startDate,
                                            job.endDate,
                                        ]
                                            .filter(Boolean)
                                            .join(" – ")}
                                    </Text>
                                </View>

                                <Text style={styles.subtitle}>
                                    {[
                                        job.company,
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
                                style={styles.entry}
                                wrap={false}
                            >
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>
                                        {education.degree ||
                                            education.field}
                                    </Text>

                                    <Text style={styles.date}>
                                        {[
                                            education.startDate,
                                            education.endDate,
                                        ]
                                            .filter(Boolean)
                                            .join(" – ")}
                                    </Text>
                                </View>

                                <Text style={styles.subtitle}>
                                    {education.institution}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {cv.skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            SKILLS
                        </Text>

                        <Text style={styles.skills}>
                            {cv.skills.join("  ·  ")}
                        </Text>
                    </View>
                )}

                {cv.languages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            LANGUAGES
                        </Text>

                        <Text style={styles.skills}>
                            {cv.languages
                                .map((language) =>
                                    language.level
                                        ? `${language.name} (${language.level})`
                                        : language.name
                                )
                                .join("  ·  ")}
                        </Text>
                    </View>
                )}
            </Page>
        </Document>
    );
}