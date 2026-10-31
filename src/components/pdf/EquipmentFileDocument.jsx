// src/components/pdf/EquipmentFileDocument.tsx
// PDF template for an "Equipment File". Renders with @react-pdf/renderer.
// Per-destination theme (Mars / Moon / Deep Space) is selected from the body.
import { Document, Page, View, Text, Image, Link, Svg, Circle, Rect, StyleSheet, } from '@react-pdf/renderer';
import { THEMES, themeForBody } from './theme';
const base = StyleSheet.create({
    page: {
        paddingTop: 44,
        paddingBottom: 56,
        paddingHorizontal: 44,
        fontSize: 10.5,
        lineHeight: 1.45,
    },
    h1: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
    h2: { fontSize: 14, fontWeight: 'bold', marginTop: 14, marginBottom: 6 },
    h3: { fontSize: 11.5, fontWeight: 'bold', marginTop: 10, marginBottom: 3 },
    p: { marginBottom: 6 },
    small: { fontSize: 8.5 },
    row: { flexDirection: 'row', marginBottom: 2 },
    label: { width: 110, fontWeight: 'bold' },
    value: { flex: 1 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingVertical: 4 },
    tableKey: { width: '40%', fontWeight: 'bold', paddingRight: 8 },
    tableVal: { width: '60%' },
    bullet: { marginBottom: 3, paddingLeft: 10 },
    footer: {
        position: 'absolute',
        bottom: 24,
        left: 44,
        right: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8.5,
    },
    coverWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
    coverSub: { fontSize: 13, color: '#FFFFFF', textAlign: 'center', opacity: 0.9, marginBottom: 24 },
    coverBadge: { fontSize: 10, color: '#FFFFFF', opacity: 0.85, marginTop: 4 },
    section: { marginBottom: 10 },
    sourceItem: { marginBottom: 4 },
    sourceTitle: { fontWeight: 'bold' },
    sourceUrl: { fontSize: 8.5, color: '#3355AA' },
    statusPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
});
function formatDate(d) {
    if (!d)
        return '—';
    return d;
}
export default function EquipmentFileDocument({ equipment, body }) {
    const theme = THEMES[themeForBody(body)];
    const name = equipment.name.en;
    const bodyName = body?.name?.en ?? 'Unknown destination';
    const shortDesc = equipment.shortDescription?.en ?? '';
    const story = equipment.story?.en ?? '';
    return (<Document title={`${name} — Equipment File`} author="Abandoned but not Forgotten" subject={name}>
      {/* Cover */}
      <Page size="A4" style={[base.page, { backgroundColor: theme.band, color: '#FFFFFF' }]}>
        <View style={base.coverWrap}>
          <Svg width={110} height={110} viewBox="0 0 110 110" style={{ marginBottom: 18 }}>
            <Circle cx={55} cy={55} r={46} fill={theme.accentSoft} stroke="#FFFFFF" strokeWidth={2}/>
            <Circle cx={55} cy={55} r={26} fill={theme.accent}/>
            <Rect x={49} y={20} width={12} height={70} fill="#FFFFFF" opacity={0.25}/>
          </Svg>
          <Text style={base.coverTitle}>{name}</Text>
          <Text style={base.coverSub}>{bodyName} · Equipment File</Text>
          <View style={[base.statusPill, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
            <Text>{equipment.status.toUpperCase().replace('-', ' ')}</Text>
          </View>
          {equipment.launchDate && (<Text style={base.coverBadge}>Launched {equipment.launchDate}</Text>)}
          {equipment.arrivalDate && (<Text style={base.coverBadge}>Arrived {equipment.arrivalDate}</Text>)}
        </View>
        <View style={[base.footer, { color: '#FFFFFF' }]} fixed>
          <Text>Abandoned but not Forgotten — Archive</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}/>
        </View>
      </Page>

      {/* Content */}
      <Page size="A4" style={[base.page, { backgroundColor: theme.paper, color: theme.ink }]}>
        <View style={base.section}>
          <Text style={[base.h2, { color: theme.accent }]}>Mission Introduction</Text>
          <Text style={base.p}>{shortDesc}</Text>
          {story ? <Text style={base.p}>{story}</Text> : null}
        </View>

        <View style={base.section}>
          <Text style={[base.h2, { color: theme.accent }]}>Status</Text>
          <View style={base.row}>
            <Text style={base.label}>Status</Text>
            <Text style={base.value}>{equipment.status}</Text>
          </View>
          <View style={base.row}>
            <Text style={base.label}>Destination</Text>
            <Text style={base.value}>{bodyName}</Text>
          </View>
        </View>

        {(equipment.launchDate || equipment.arrivalDate || equipment.lastContactDate || equipment.endDate) && (<View style={base.section}>
            <Text style={[base.h2, { color: theme.accent }]}>Mission Dates</Text>
            {equipment.launchDate && (<View style={base.row}>
                <Text style={base.label}>Launch</Text>
                <Text style={base.value}>{formatDate(equipment.launchDate)}</Text>
              </View>)}
            {equipment.arrivalDate && (<View style={base.row}>
                <Text style={base.label}>Arrival</Text>
                <Text style={base.value}>{formatDate(equipment.arrivalDate)}</Text>
              </View>)}
            {equipment.lastContactDate && (<View style={base.row}>
                <Text style={base.label}>Last contact</Text>
                <Text style={base.value}>{formatDate(equipment.lastContactDate)}</Text>
              </View>)}
            {equipment.endDate && (<View style={base.row}>
                <Text style={base.label}>End</Text>
                <Text style={base.value}>{formatDate(equipment.endDate)}</Text>
              </View>)}
          </View>)}

        {equipment.specs && Object.keys(equipment.specs).length > 0 && (<View style={base.section}>
            <Text style={[base.h2, { color: theme.accent }]}>Specifications</Text>
            <View style={{ borderWidth: 1, borderColor: theme.rule, borderRadius: 4 }}>
              {Object.entries(equipment.specs).map(([k, v]) => (<View key={k} style={[base.tableRow, { borderBottomColor: theme.rule }]}>
                  <Text style={base.tableKey}>{k}</Text>
                  <Text style={base.tableVal}>{v}</Text>
                </View>))}
            </View>
          </View>)}

        {equipment.coord && (<View style={base.section}>
            <Text style={[base.h2, { color: theme.accent }]}>Location</Text>
            <View style={base.row}>
              <Text style={base.label}>Latitude</Text>
              <Text style={base.value}>{equipment.coord.lat}°</Text>
            </View>
            <View style={base.row}>
              <Text style={base.label}>Longitude</Text>
              <Text style={base.value}>{equipment.coord.lon}°</Text>
            </View>
            <Text style={[base.small, { color: theme.muted, marginTop: 2 }]}>
              Source: {equipment.coord.source}
            </Text>
          </View>)}

        {equipment.achievements?.en?.length ? (<View style={base.section}>
            <Text style={[base.h2, { color: theme.accent }]}>Achievements</Text>
            {equipment.achievements.en.map((a, i) => (<Text key={i} style={base.bullet}>• {a}</Text>))}
          </View>) : null}

        <View style={base.section}>
          <Text style={[base.h2, { color: theme.accent }]}>Imagery</Text>
          {equipment.imageUrl ? (<Image src={equipment.imageUrl} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }}/>) : (<View style={{ height: 120, backgroundColor: theme.accentSoft, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: theme.muted, fontSize: 9 }}>No mission imagery available in archive.</Text>
            </View>)}
        </View>

        {equipment.sources?.length ? (<View style={base.section}>
            <Text style={[base.h2, { color: theme.accent }]}>Sources</Text>
            {equipment.sources.map((s, i) => (<View key={i} style={base.sourceItem}>
                <Text style={base.sourceTitle}>{i + 1}. {s.title}</Text>
                <Link src={s.url} style={base.sourceUrl}>
                  {s.url}
                </Link>
              </View>))}
          </View>) : null}

        <View style={[base.footer, { color: theme.muted }]} fixed>
          <Text>{name} — Equipment File</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}/>
        </View>
      </Page>
    </Document>);
}
