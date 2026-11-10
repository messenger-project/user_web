import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

import type { CvData } from "@/types/cv";

interface CreativeTemplateProps {
    cv: CvData;
}

const colors = {
    navy: "#02394F",
    blue: "#008EED",
    orange: "#FD7E27",
    background: "#F0F4F7",
    text: "#141414",
    muted: "#54595F",
    white: "#FFFFFF",
};

const styles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 9,
        color: colors.text,
        backgroundColor: colors.white,
    },
    header: {
        backgroundColor: colors.navy,
        paddingTop: 35,
        paddingBottom: 30,
        paddingHorizontal: 35,
    },
    accent: {
        width: 45,
        height: 4,
        backgroundColor: colors.orange,
        marginBottom: 15,
    },
    name: {
        fontFamily: "Helvetica-Bold",
        fontSize: 27,
        color: colors.white,
        marginBottom: 8,
    },
    jobTitle: {
        fontSize: 12,
        color: "#C5E2ED",
        marginBottom: 15,
    },
    contact: {
        fontSize: 8,
        color: colors.white,
        lineHeight: 1.6,
    },
    body: {
        flexDirection: "row",
        alignItems: "stretch",
    },
    main: {
        width: "65%",
        paddingTop: 25,
        paddingHorizontal: 30,
        paddingBottom: 30,
    },
    sidebar: {
        width: "35%",
        backgroundColor: colors.background,
        paddingTop: 25,
        paddingHorizontal: 18,
        paddingBottom: 30,
    },
    section: {
        marginBottom: 22,
    },
    sectionHeading: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        color: colors.orange,
        marginBottom: 12,
        letterSpacing: 0.7,
    },
    paragraph: {
        fontSize: 9,
        lineHeight: 1.6,
        color: colors.muted,
    },
    entry: {
        marginBottom: 16,
    },
    entryTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        color: colors.navy,
        marginBottom: 5,
    },
    meta: {
        fontSize: 8,
        color: colors.muted,
        marginBottom: 7,
    },
    bullet: {
        fontSize: 8.5,
        lineHeight: 1.5,
        color: colors.muted,
        marginBottom: 4,
    },
    sidebarTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        color: colors.navy,
        marginBottom: 12,
    },
    skill: {
        fontSize: 8.5,
        color: colors.navy,
        backgroundColor: colors.white,
        paddingVertical: 6,
        paddingHorizontal: 9,
        marginBottom: 6,
        borderRadius: 4,
    },
    language: {
        fontSize: 8.5,
        color: colors.muted,
        marginBottom: 9,
        lineHeight: 1.5,
    },
});

export default function CreativeTemplate({
    cv,
}: CreativeTemplateProps) {
    const contact = [
        cv.personal.location,
        cv.personal.email,
        cv.personal.phone,
        cv.personal.linkedin,
        cv.personal.website,
    ]
        .filter(Boolean)
        .join("  /  ");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.accent} />

                    <Text style={styles.name}>
                        {cv.personal.fullName}
                    </Text>

                    {cv.personal.title && (
                        <Text style={styles.jobTitle}>
                            {cv.personal.title}
                        </Text>
                    )}

                    {contact && (
                        <Text style={styles.contact}>
                            {contact}
                        </Text>
                    )}
                </View>

                <View style={styles.body}>
                    <View style={styles.main}>
                        {cv.summary && (
                            <View style={styles.section}>
                                <Text style={styles.sectionHeading}>
                                    01 / ABOUT ME
                                </Text>
                                <Text style={styles.paragraph}>
                                    {cv.summary}
                                </Text>
                            </View>
                        )}

                        {cv.experience.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionHeading}>
                                    02 / EXPERIENCE
                                </Text>

                                {cv.experience.map((job, index) => (
                                    <View
                                        key={index}
                                        style={styles.entry}
                                        wrap={false}
                                    >
                                        <Text style={styles.entryTitle}>
                                            {job.position}
                                        </Text>

                                        <Text style={styles.meta}>
                                            {[
                                                job.company,
                                                job.location,
                                                [
                                                    job.startDate,
                                                    job.endDate,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" – "),
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
                                <Text style={styles.sectionHeading}>
                                    03 / EDUCATION
                                </Text>

                                {cv.education.map((education, index) => (
                                    <View
                                        key={index}
                                        style={styles.entry}
                                        wrap={false}
                                    >
                                        <Text style={styles.entryTitle}>
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
                                                .join(" – ")}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.sidebar}>
                        {cv.skills.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sidebarTitle}>
                                    EXPERTISE
                                </Text>

                                {cv.skills.map((skill, index) => (
                                    <Text
                                        key={index}
                                        style={styles.skill}
                                    >
                                        {skill}
                                    </Text>
                                ))}
                            </View>
                        )}

                        {cv.languages.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sidebarTitle}>
                                    LANGUAGES
                                </Text>

                                {cv.languages.map(
                                    (language, index) => (
                                        <Text
                                            key={index}
                                            style={styles.language}
                                        >
                                            {language.name}
                                            {language.level
                                                ? ` — ${language.level}`
                                                : ""}
                                        </Text>
                                    )
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}