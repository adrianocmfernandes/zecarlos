import { renderToStream, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type QuotePdfInput = {
  quoteNumber: string;
  clientName: string;
  lines: Array<{ descricao: string; quantidade: number; unitPrice: number; lineTotal: number }>;
  total: number;
};

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12 },
  heading: { fontSize: 20, marginBottom: 12 },
  line: { marginBottom: 6 },
  total: { marginTop: 16, fontSize: 14 }
});

export async function gerarPdfOrcamento(input: QuotePdfInput) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Orçamento #{input.quoteNumber}</Text>
        <Text style={styles.line}>Cliente: {input.clientName}</Text>
        <View style={{ marginTop: 10 }}>
          {input.lines.map((line, idx) => (
            <Text key={`${line.descricao}-${idx}`} style={styles.line}>
              {line.descricao} — {line.quantidade} x €{line.unitPrice.toFixed(2)} = €{line.lineTotal.toFixed(2)}
            </Text>
          ))}
        </View>
        <Text style={styles.total}>Total: €{input.total.toFixed(2)}</Text>
      </Page>
    </Document>
  );

  return renderToStream(doc);
}
