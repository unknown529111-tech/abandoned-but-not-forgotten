// src/components/equipment/DownloadButton.tsx
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import EquipmentFileDocument from '../pdf/EquipmentFileDocument';
export default function DownloadButton({ equipment, body }) {
    const { t } = useTranslation();
    return (<PDFDownloadLink document={<EquipmentFileDocument equipment={equipment} body={body}/>} fileName={`${equipment.id}-equipment-file.pdf`} className="eq-download motion-download">
      {({ loading }) => (loading ? 'Preparing PDF…' : t('download'))}
    </PDFDownloadLink>);
}
