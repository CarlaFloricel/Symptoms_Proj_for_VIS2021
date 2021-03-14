#!flask/bin/python
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from sklearn.cluster import AgglomerativeClustering 
from sklearn.decomposition import PCA
from pandas import pandas
import pandas as pd
import math 
import numpy as np
from copy import deepcopy

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
@cross_origin()
def get_tasks():
	pca = PCA()
	data = request.json
	dataset =  pd.read_csv(data['filename'])
	# dataset =  pd.read_csv('D:/sem1/VDS/symptom_project/cs529-project/data/output/multi-dim-5-timepoints-0_t.csv')
	symp = data['symptoms']
	


	
	symp1 = deepcopy(symp)

	# for el in symp1:
	# 	symp.append(el+'1')

	# for el in symp1:
	# 	symp.append(el+'2')
	
	# for el in symp1:
	# 	symp.append(el+'3')

	# for el in symp1:
	# 	symp.append(el+'4')	


	z = dataset[symp]
	patientId = data['patientId']
	x = z.values
	patients = dataset.iloc[:, list(range(28))]

	

	# patients = dataset.iloc[:, list(range(59))]
	# patients = dataset.iloc[:, list(range(87))]
	# patients = dataset.iloc[:, list(range(115))]
	# patients = dataset.iloc[:, list(range(142))]


	print(patients)
	p = patients[symp]
	x_pca = pca.fit_transform(p)
	x_pca = pd.DataFrame(x_pca)
	if len(symp) ==1:
		x_pca['PC2'] = [[0]] *len(patients)
	x_pca = x_pca.iloc[:, list(range(2))]
	x_pca.columns = ['PC1', 'PC2']
	dataset['PC1'] = x_pca['PC1']
	dataset['PC2'] = x_pca['PC2']

	x_pca_pc1 = x_pca['PC1'].to_numpy()
	x_pca_pc1 = (x_pca_pc1 - x_pca_pc1.mean()) / np.std(x_pca_pc1)

	if len(symp) !=1:
		x_pca_pc2 = x_pca['PC2'].to_numpy()
		x_pca_pc2 = (x_pca_pc2 - x_pca_pc2.mean()) / np.std(x_pca_pc2)
		dataset['PC2'] = x_pca_pc2
	dataset['PC1'] = x_pca_pc1

	print(x_pca_pc1)

	if(len(patientId)>0):
		l = []
		d = {}
		dp = {}
		for i,row in dataset.iterrows():
			l.append([row['PC1'],row['PC2']])
			d[int(row['patientId'])]=i
			dp[i]= int(row['patientId'])
		
		crt_patient = d[int(patientId)]

		distance_list = []
		for i, elem in enumerate(l):
			distance_list.append([i, math.sqrt((elem[0] - l[crt_patient][0])**2 +  (elem[1] - l[crt_patient][1])**2)])

		distance_list.sort(key=lambda x:x[1])

		return  jsonify([dp[distance_list[1][0]], dp[distance_list[2][0]], dp[distance_list[3][0]]])

	h = AgglomerativeClustering(n_clusters =2, affinity = 'euclidean', linkage = 'ward')
	y = h.fit_predict(x)
	dataset['cluster'] = y

	dataset = dataset.transpose()
	dataset = dataset.to_dict()

	sum0 = -1
	sum1 = -1

	for index, row in dataset.items():
		if row['cluster'] == 0:
			sum0 =row['sum']
		if row['cluster'] == 1 and sum0 != -1:
			sum1 =row['sum']
			break

	while sum1==sum0:
		sum0 = -1
		for index, row in dataset.items():
			if index > 0:
				if row['cluster'] == 0:
					sum0 = row['sum']
					break
	if sum0 > sum1:
		for index, row in dataset.items():
			if int(row['cluster']) == 0:
				row['cluster'] = 1
			else:
				row['cluster'] = 0

	return jsonify(dataset)

if __name__ == '__main__':
	app.run(debug=True)