import pandas as pd
from sdv.single_table import GaussianCopulaSynthesizer
from sdv.metadata import SingleTableMetadata

def generate_synthetic_adv(df, num_rows=100):
    metadata = SingleTableMetadata()
    metadata.detect_from_dataframe(df)

    synthesizer = GaussianCopulaSynthesizer(metadata)
    synthesizer.fit(df)

    synthetic_data = synthesizer.sample(num_rows)
    return synthetic_data
