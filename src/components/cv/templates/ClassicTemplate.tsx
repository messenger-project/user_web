import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

import type { CvData } from "@/types/cv";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: "#222222",
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
        textAlign: "center",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    title: {
        fontSize: 12,
        marginBottom: 5,
    },
    contact: {
        fontSize: 9,
        color: "#555555",
    },
    section: {
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
        marginBottom: 6,
        paddingBottom: 3,
    },
    item: {
        marginBottom: 8,
    },
    itemTitle: {
        fontWeight: "bold",
    },
    bullet: {
        marginLeft: 10,
        marginTop: 3,
    },
});

interface ClassicTemplateProps {
    cv: CvData;
}

export default function ClassicTemplate({ cv }: ClassicTemplateProps) {
    const contact = [
        cv.personal.email,
        cv.personal.phone,
        cv.personal.location,
        cv.personal.linkedin,
        cv.personal.website,
    ].filter(Boolean).join(" | ");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>{cv.personal.fullName}</Text>
                    {cv.personal.title && (
                        <Text style={styles.title}>{cv.personal.title}</Text>
                    )}
                    <Text style={styles.contact}>{contact}</Text>
                </View>

                {cv.summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
                        <Text>{cv.summary}</Text>
                    </View>
                )}

                {cv.experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
                        {cv.experience.map((item, index) => (
                            <View key={index} style={styles.item} wrap={false}>
                                <Text style={styles.itemTitle}>
                                    {item.position} — {item.company}
                                </Text>
                                <Text>
                                    {[item.startDate, item.endDate]
                                        .filter(Boolean)
                                        .join(" - ")}
                                </Text>
                                {item.highlights.map((highlight, i) => (
                                    <Text key={i} style={styles.bullet}>
                                        • {highlight}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {cv.education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>EDUCATION</Text>
                        {cv.education.map((item, index) => (
                            <View key={index} style={styles.item} wrap={false}>
                                <Text style={styles.itemTitle}>
                                    {item.degree} — {item.institution}
                                </Text>
                                <Text>
                                    {[item.startDate, item.endDate]
                                        .filter(Boolean)
                                        .join(" - ")}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {cv.skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SKILLS</Text>
                        <Text>{cv.skills.join(", ")}</Text>
                    </View>
                )}

                {cv.languages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>LANGUAGES</Text>
                        <Text>
                            {cv.languages
                                .map((lang) =>
                                    lang.level
                                        ? `${lang.name} (${lang.level})`
                                        : lang.name
                                )
                                .join(", ")}
                        </Text>
                    </View>
                )}
            </Page>
        </Document>
    );
}